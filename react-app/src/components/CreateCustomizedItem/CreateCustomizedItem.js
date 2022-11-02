import { useState, useEffect } from "react";
import {
  createCustomizedItem,
  getAllCustomizedItems,
} from "../../store/customizedItem";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { addCustomizedSelectionToCustomizedItem } from "../../store/customized_selections";
import Customization from "../Customization/Customization";
import { getAllItems } from "../../store/items";


const CreateCustomizedItem = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customizationSelected, setCustomizationSelected] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    dispatch(getAllCustomizedItems());
    dispatch(getAllItems());
  }, [dispatch]);

  useEffect(() => {
    let errors = [];
    if (name.length < 4 || name.length > 255)
      errors.push("Name needs to be between 4 and 255 characters");

    return setErrors(errors);
  }, [name]);

  const allItems = useSelector((state) => state.items);
  const sessionUser = useSelector((state) => state.session.user);
  const { itemId } = useParams();
//  console.log(
//    "customizationSelected-----------------------",
//    customizationSelected
//  );
  if (!itemId) return null;

  const item = allItems[itemId];

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (errors.length) return;

    let customizedItemData = {
      user_id: sessionUser.id,
      item_id: itemId,
      name: name,
    };

    setErrors([]);
    const data = await dispatch(createCustomizedItem(customizedItemData)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    ); // data should contain newly created customized item's ID

    // create new customized selection object using customized item ID from above
    // and customization ID from customizationSelected

    if (data) {
      // console.log("---------------------------newly created customized item: ", data);
      // console.log(
      //   "customizationSelected-----------------------",
      //   customizationSelected
      // );
      for (let i in customizationSelected) {
        if (customizationSelected[i] != 0) {
          // console.log("=======customization_id:", customizationSelected[i]);
          const new_customized_selection = await dispatch(
            addCustomizedSelectionToCustomizedItem(
              customizationSelected[i],
              data.id
            )
          );
        }
      }
      history.push(`/my-customized-items`);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => onSubmit(e)}>
        <h1>customize your drink here</h1>
        <img
          src={item?.image_url}
          width="300px"
          height="300px"
          alt="drink"
        ></img>
        {isSubmitted && (
          <div>
            {errors.map((error) => (
              <div className="each-error" key={error}>
                {error}
              </div>
            ))}
          </div>
        )}
        <div>
          <label>
            Name your drink
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <Customization
          customizationSelected={customizationSelected}
          setCustomizationSelected={setCustomizationSelected}
        />
        <button
          className="create-item-submit-button"
          type="submit"
          disabled={isSubmitted && errors.length > 0}
        >
          Save
        </button>
      </form>
    </div>
  );
};
export default CreateCustomizedItem;
/*
customizationSelected is a reference in memory that is an object containing {category: customization_id}
for example: {milk:1} or {milk: '7', flavor: '16'} depending on the selected field in CreateCustomizedItem
CreateCustomizedItem(parent componentt) pass down customizationSelected as props to Customization(child component)
Within child Customization, any changes being made to customizationSelected is reflected in the parent component as well
For that reason, even though the selection for customization(changes) is being made inside the Customization(child component),
the parent component CreateCustomizedItem still have reference to the same object customizationSelected

--------JS pass props as reference, not value.
This means as long as parent pass down a props via the same reference in memory,
any changes being to that reference in memory will be reflected in the parent component-----------
*/
