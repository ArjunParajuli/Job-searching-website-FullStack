import React, {useEffect} from 'react'
import Wrapper from '../wrappers/propertiesWrapper'
import { useAppContext } from '../context/AppContext';
import Alert from './Alert';
import Property from './Property';

const Properties = () => {
    const {
        getAllProperties,
        properties,
        isLoading,
        page,
        totalProperties,
        numOfPages,
        showAlert,
      } = useAppContext();

      useEffect(() => {
        getAllProperties();
      }, []);

      if (properties?.length === 0) {
        return (
          <Wrapper>
            <h2>No properties to display...</h2>
          </Wrapper>
        );
      }
    
      return (
        <Wrapper>
          {showAlert && <Alert />}
          <h5>
            {totalProperties} properties{properties?.length > 1 && 's'} found
          </h5>
          <div className='properties'>
            {properties?.map((p) => {
              return <Property key={p._id} {...p} />
            })}
          </div>
        </Wrapper>
      );
    };
export default Properties