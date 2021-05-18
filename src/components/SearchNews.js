import React from 'react';

const SearchNews = (props) => {
  // const handleChange = (e) => {
  //   props.searchValue(e.target.value);
  // };
  return (
    <form
      method="POST "
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name="formName"
      className="center"
    >
      <label>
        <span>Search Shows: </span>
        <input
          autoComplete="off"
          type="text"
          name="searchTerm"
          onInput={e=> props.searchValue(e.target.value)}
        />
      </label>
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchNews;