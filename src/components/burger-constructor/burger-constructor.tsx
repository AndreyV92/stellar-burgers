import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  closeModalOrderSubmit,
  fetchOrderSubmit
} from '../../services/slices/orderSubmitSlice/orderSubmitSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useSelector(() => {

  // })

  const constructorItems = useSelector((state) => state.makeBurger);
  const user = useSelector((state) => state.user.userData);

  const orderRequest = useSelector((state) => state.orderSubmit.orderRequest);

  const orderModalData = useSelector((state) => state.orderSubmit.orderData);

  const onOrderClick = () => {
    if (
      !constructorItems.bun ||
      orderRequest ||
      !constructorItems.ingredients.length
    )
      return;

    if (!user) {
      navigate('/login');
    } else {
      dispatch(
        fetchOrderSubmit([
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((el) => el._id),
          constructorItems.bun._id
        ])
      );
    }
  };
  const closeOrderModal = () => {
    dispatch(closeModalOrderSubmit());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
