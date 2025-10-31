import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useData } from "contexts";
import {
  CATEGORY_FILTER,
  ITEMS_FILTER,
  TOGGLE_STOCK,
  SORT,
  RATING,
  CLEAR_FILTERS,
  PRICERANGE_FILTER,
} from "../../constants";
import "./productlist.css";

function Filters() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { state, dispatch } = useData();

  const dispatchHandler = (typeOfState, typeofAction) => {
    dispatch({ type: typeOfState, payload: typeofAction });
  };

  return (
    <>
      <section
        className={showMobileFilters ? "mobile-filters-form" : "filters"}
      >
        <div className="filter-header">
          {showMobileFilters ? (
            <button
              className="btn-link btn-link-primary btn-no-decoration"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              APPLY
            </button>
          ) : (
            <span>FILTERS</span>
          )}
          <button
            className="btn-link btn-link-primary btn-no-decoration"
            onClick={() => dispatchHandler(CLEAR_FILTERS)}
          >
            CLEAR
          </button>
        </div>
        <hr />

        {/* Keep only PRICE RANGE and ITEMS filters as requested */}
        <div className="filter-price-range">
          <span className="filter-heading">PRICE RANGE</span>
          <div>
            <input
              type="checkbox"
              id="under500"
              className="small-text"
              name="priceCategory"
              checked={state.priceRange.under500}
              onChange={() =>
                dispatchHandler(PRICERANGE_FILTER, { priceRange: "under500" })
              }
            />
            <label className="gray-text small-text" htmlFor="under500">
              Under Rs. 500
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="price-500to1000"
              className="small-text"
              name="priceCategory"
              checked={state.priceRange.price500To1000}
              onChange={() =>
                dispatchHandler(PRICERANGE_FILTER, {
                  priceRange: "price500To1000",
                })
              }
            />
            <label className="gray-text small-text" htmlFor="price-500to1000">
              Rs. 500 - Rs. 1000
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="price-1000to1500"
              className="small-text"
              name="priceCategory"
              checked={state.priceRange.price1000To1500}
              onChange={() =>
                dispatchHandler(PRICERANGE_FILTER, {
                  priceRange: "price1000To1500",
                })
              }
            />
            <label className="gray-text small-text" htmlFor="price-1000to1500">
              Rs. 1000 - Rs. 1500
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="price-1500to2000"
              className="small-text"
              name="priceCategory"
              checked={state.priceRange.price1500To2000}
              onChange={() =>
                dispatchHandler(PRICERANGE_FILTER, {
                  priceRange: "price1500To2000",
                })
              }
            />
            <label className="gray-text small-text" htmlFor="price-1500to2000">
              Rs. 1500 - Rs. 2000
            </label>
          </div>
          <hr />
        </div>

        <div className="filter-items">
          <span className="filter-heading">ITEMS</span>
          <div>
            <input
              type="checkbox"
              id="item-cakes"
              className="small-text"
              name="itemCategory"
              checked={state.items.Cake}
              onChange={() => dispatchHandler(ITEMS_FILTER, { item: "Cake" })}
            />
            <label className="gray-text small-text" htmlFor="item-cakes">
              Cakes
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="item-muffins"
              className="small-text"
              name="itemCategory"
              checked={state.items.Muffin}
              onChange={() => dispatchHandler(ITEMS_FILTER, { item: "Muffin" })}
            />
            <label htmlFor="item-muffins" className="gray-text small-text">
              Muffins
            </label>
          </div>
          <hr />
        </div>

        {/* removed other filters to keep the UI minimal per request */}
      </section>

      <div className="mobile-filters">
        <div
          className="mobile-filter-header"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          FILTERS
        </div>
        <div>
          <button
            className="btn-link btn-link-primary btn-no-decoration"
            onClick={() => dispatchHandler(CLEAR_FILTERS)}
          >
            CLEAR
          </button>
        </div>
      </div>
    </>
  );
}

export { Filters };
