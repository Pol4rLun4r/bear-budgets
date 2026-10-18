// styles
import classes from './PageManager.module.css';

// redux
import { activePageData } from '../store/layout.selectors';
import { useAppSelector } from '@/app/reduxHooks';

const PageManager = () => {
  const activePageLabel = useAppSelector(activePageData)?.label;

  return (
    <main className={classes.main}>
      {activePageLabel}
    </main>
  )
}

export default PageManager;