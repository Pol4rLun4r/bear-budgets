// mantine
import {
  Combobox,
  TextInput,
  useCombobox,
} from "@mantine/core"
import { useCallback, useState } from "react"
import itemApi from "../../../../services/item-api"

// Ajuste o tipo conforme o retorno da sua API de itens
export type ItemSuggestion = {
  id: string
  description: string
  [key: string]: unknown
}

const AddItem = () => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const fetchSuggestions = useCallback(async (search: string) => {
    if (!search.trim()) {
      setSuggestions([])
      return ;
    }

    try {
      const items = await itemApi.searchItem(search)

      setSuggestions(Array.isArray(items) ? items : items?.data ?? [])
    } catch (error) {
      setSuggestions([])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setQuery(value)
    combobox.openDropdown()
    combobox.updateSelectedOptionIndex()
    fetchSuggestions(value)
  }

  // Só é chamado quando o usuário clica ou dá Enter em uma sugestão (não ao só digitar)
  const handleOptionSubmit = (optionValue: string) => {
    const item = suggestions.find((s) => s.id === optionValue)
    if (item) {
      // Aqui você carrega os dados do item (já tem o objeto ou pode buscar de novo)
      console.log("Item selecionado:", item)
      setQuery(item.description)
    }
    combobox.closeDropdown()
  }

  const options = suggestions.map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      {item.description}
    </Combobox.Option>
  ))

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleOptionSubmit}
    >
      <Combobox.Target>
        <TextInput
          radius="lg"
          label="Descrição do item"
          placeholder="Porca M8 3 x 4"
          value={query}
          onChange={handleChange}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          onClick={() => combobox.openDropdown()}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? (
            <Combobox.Empty>Nenhum resultado</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default AddItem