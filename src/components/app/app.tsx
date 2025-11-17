import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingridientsSlice/ingridientsSlice';
import { userApi } from '../../services/slices/userSlice/userSliceApi';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(userApi());
  }, []);
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route element={<ConstructorPage />} path='/' />
        <Route element={<Feed />} path='/feed' />
        <Route element={<Login />} path='/login' />
        <Route element={<Register />} path='/register' />
        <Route element={<ForgotPassword />} path='/forgot-password' />
        <Route element={<ResetPassword />} path='/reset-password' />
        <Route element={<Profile />} path='/profile' />
        <Route element={<ProfileOrders />} path='/profile/orders' />
        <Route element={<NotFound404 />} path='*' />
        <Route
          element={
            <Modal
              title='Детали заказа'
              onClose={() => {
                navigate(-1);
              }}
            >
              <OrderInfo />
            </Modal>
          }
          path='/feed/:number'
        />
        <Route
          element={
            <Modal
              title='Детали заказа'
              onClose={() => {
                navigate(-1);
              }}
            >
              <IngredientDetails />
            </Modal>
          }
          path='/ingredients/:id'
        />
        <Route
          element={
            <Modal
              title='Детали заказа'
              onClose={() => {
                navigate(-1);
              }}
            >
              {<OrderInfo />}
            </Modal>
          }
          path='/profile/orders/:number'
        />
      </Routes>
    </div>
  );
};
export default App;
