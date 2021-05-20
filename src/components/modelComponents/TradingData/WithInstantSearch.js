import React from 'react';
import PropTypes from 'prop-types';
import { InstantSearch } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';


const searchClient = algoliasearch(
  '33EO0JJW59',
  '82086de1fc1c9cc49784f09a485074ba'
);

const WithInstantSearch = ({ children }) => {
  return (
    <InstantSearch
      indexName='exchange-listings'
      searchClient={searchClient}>
      {children}
    </InstantSearch>
  );
};

WithInstantSearch.propTypes = {
  children: PropTypes.element.isRequired
};

export default WithInstantSearch;
