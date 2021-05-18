import React from 'react';

const SearchNews = (props) => {
  const handleChange = (e) => {
     
    props.searchValue(e.target.value);
  };
  return (
    <form
      method="POST "
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //   }}
      name="formName"
      className="center"
    >
      <label>
        <span>Search News </span>
        <input
          autoComplete="off"
          type="text"
          name="searchTerm"
          onChange={handleChange}
         
        />
      </label>
      {/* <button type="submit">Search</button> */}
    </form>
  );
};

export default SearchNews;