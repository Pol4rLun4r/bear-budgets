/* eslint-disable no-useless-assignment */
import type { Database } from 'better-sqlite3';

// repositories
import { createRepositories } from '../../repositories/index.js';

// rules
import { createRules } from '../../rules/index.js';

// utils
import { success, failure } from '../../utils/handleSuccess.js';

const updateQuotationLineService = (db: Database) => (payload: UpdateQuotationLinePayload) => {
    const repo = createRepositories(db);
    const rules = createRules();

    const validation = rules.quotation.updateLine(payload);

    if (!validation.success) {
        return validation;
    }

    const { quotation_link_id, item_reference, item_values, reference_links } = validation.data;

    const refRepo = repo.item.reference;
    const valuesRepo = repo.item.values;
    const linksRepo = repo.item.referenceLinks;
    const linkRepo = repo.quotation.links;

    return db.transaction(() => {
        const quotationLink = linkRepo.getById(quotation_link_id);
        if (!quotationLink) {
            return failure('quotation_link not found');
        }

        let referenceId = quotationLink.item_reference_id;
        let valuesId = quotationLink.item_values_id;

        if (item_reference.id) {
            referenceId = item_reference.id;
        } else {
            const inserted = refRepo.create(item_reference as ItemReference);
            referenceId = inserted;
        }

        if (item_values.id) {
            valuesRepo.update(item_values.id, item_values);
            valuesId = item_values.id;
        } else {
            const inserted = valuesRepo.create(referenceId, {
                ...item_values,
                item_reference_id: referenceId,
            } as ItemValues);
            valuesId = inserted;
        }

        linksRepo.replaceForReference(referenceId, reference_links.map((link) => link.content).filter(Boolean));

        linkRepo.update(quotation_link_id, {
            item_reference_id: referenceId,
            item_values_id: valuesId,
        });

        return success({
            quotation_link_id,
            item_reference: refRepo.getByIdWithoutLinks(referenceId)!,
            item_values: valuesRepo.getById(valuesId)!,
            reference_links: linksRepo.getByReferenceId(referenceId)!,
        });
    })();
};

export default updateQuotationLineService;
