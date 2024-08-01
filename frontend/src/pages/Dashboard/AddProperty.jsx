import FormRow from '../../components/FormRow'
import Alert from '../../components/Alert'
import { useAppContext } from '../../context/AppContext'
import Wrapper from '../../wrappers/profileForm'
import { EMPTY_FIELDS } from '../../context/action'
import FormRowSelect from '../../components/FormRowSelect'

const AddProperty = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    owner,
    price,
    propertyLocation,
    propertyType,
    propertyTypeOptions,
    status,
    statusOptions, 
    createProperty,
    handleChangeInContext,
    editProperty
  } = useAppContext()
  
  
  const handleSubmit = (e) => {
    e.preventDefault()

    if(isEditing){
      editProperty()
      return;
    }

    if (!owner || !propertyLocation) {
      displayAlert(EMPTY_FIELDS)
      return
    }
    createProperty()
  }

  const changeHandler = (e) => {
    handleChangeInContext(e.target.value, e.target.name)
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit property' : 'add property'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          {/* owner */}
          <FormRow
            type='text'
            name='owner'
            value={owner}
            changeHandler={changeHandler}
          />
          {/* price */}
          <FormRow
            type='text'
            labelText='Price'
            name='price'
            value={price}
            changeHandler={changeHandler}
          />
          {/* location */}
          <FormRow
            type='text'
            labelText='Location'
            name='propertyLocation'
            value={propertyLocation}
            changeHandler={changeHandler}
          />
          {/* property status */}
          <FormRowSelect
            name='status'
            defaultValue={status}
            changeHandler={changeHandler}
            list={statusOptions}
          />
          {/* property type */}
           <FormRowSelect
            name='propertyType'
            labelText='property type'
            defaultValue={propertyType}
            changeHandler={changeHandler}
            list={propertyTypeOptions}
          /> 
          {/* btn container */}
          <div className='btn-container'>
            <button
              type='submit'
              className='btn btn-block submit-btn'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddProperty