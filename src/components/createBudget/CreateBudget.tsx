// styles
import classes from './CreateBudget.module.css'

// components
import CreateClient from './CreateClient'
import SearchClient from './SearchClient/SearchClient'

const CreateBudget = () => {
    return (
        <div className={classes.container}>
            <SearchClient />
            {/* <CreateClient/> */}
        </div>
    )
}

export default CreateBudget