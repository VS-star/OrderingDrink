import { useState, useEffect } from "react";
import { createCustomizedItem } from "../../store/customizedItem";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getAllItems } from "../../store/items";

import "./CreateCustomizedItem.css";



const CreateCustomizedItem = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getAllItems());
  }, [dispatch]);

  const allItems = useSelector((state) => state.items);
  const sessionUser = useSelector((state) => state.session.user);
  const { itemId } = useParams();
  console.log("ITEMID-------------------", itemId);

  if (!itemId) return null;

  const item = allItems.filter((item) => item.id === +itemId);

  const onSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitted(true);
    //  if (errors.length) return;

    let customizedItemData = {
      user_id : sessionUser.id,
      item_id : itemId
    };

    //  setErrors([]);
    const data = await dispatch(createCustomizedItem(customizedItemData)).catch(
      async (res) => {
        const data = await res.json();
        //    if (data && data.errors) setErrors(data.errors);
      }
    );

    if (data) {
      history.push(`/my-customized-items`);
    }
  };

  return(
    <div>
      <h1>customize your drink here</h1>;

    </div>




  )
};
export default CreateCustomizedItem;