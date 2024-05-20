import { useRoutes } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import Logout from '@/pages/Logout';
import NotFound from '@/pages/NotFound.jsx';
import Dashboard from '@/pages/Dashboard';
import Customer from '@/pages/Customer';
import Inventory from '@/pages/Inventory';
import Order from '@/pages/Order';
import Invoice from '@/pages/Invoice';
import InvoiceCreate from '@/pages/Invoice/InvoiceCreate';
import InvoiceRead from '@/pages/Invoice/InvoiceRead';
import InvoiceUpdate from '@/pages/Invoice/InvoiceUpdate';
import InvoiceRecordPayment from '@/pages/Invoice/InvoiceRecordPayment';
import Quote from '@/pages/Quote/index';
import QuoteCreate from '@/pages/Quote/QuoteCreate';
import QuoteRead from '@/pages/Quote/QuoteRead';
import QuoteUpdate from '@/pages/Quote/QuoteUpdate';
import Payment from '@/pages/Payment/index';
import PaymentRead from '@/pages/Payment/PaymentRead';
import PaymentUpdate from '@/pages/Payment/PaymentUpdate';
import Employee from '@/pages/Employee';
import Admin from '@/pages/Admin';
import Settings from '@/pages/Settings/Settings';
import PaymentMode from '@/pages/PaymentMode';
import Teams from '@/pages/Roles';
import Permissions from '@/pages/Permissions';
import Permission from '@/pages/permission';
import History from '@/pages/History';
import Email from '@/pages/Email/index';
import EmailRead from '@/pages/Email/EmailRead';
import EmailUpdate from '@/pages/Email/EmailUpdate';
import AdvancedSettings from '@/pages/AdvancedSettings';
import Profile from '@/pages/Profile';
import Application from '@/pages/Application/index';
import Offer from '@/pages/Offer/index';
import OfferCreate from '@/pages/Offer/OfferCreate';
import OfferRead from '@/pages/Offer/OfferRead';
import CourseInfo from '@/pages/courseInfo';

export default function AppRouter() {
  let element = useRoutes([
    {
      path: '/login',
      element: <PublicRoute />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/courseInfo',
      element: <CourseInfo />,
    },
    {
      path: '/inventory',
      element: <Inventory />,
    },
    {
      path: '/order',
      element: <Order />,
    },
    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },
    {
      path: '/employee',
      element: <Employee />,
    },
    {
      path: '/admin',
      element: <Admin />,
    },
    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/roles',
      element: <Teams />,
    },
    {
      path: '/email',
      element: <Email />,
    },
    {
      path: '/history',
      element: <History />,
    },
    {
      path: '/email/read/:id',
      element: <EmailRead />,
    },
    {
      path: '/email/update/:id',
      element: <EmailUpdate />,
    },
    {
      path: '/settings/advanced',
      element: <AdvancedSettings />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/permissions',
      element: <Permissions />,
    },
    {
      path: '/permission',
      element: <Permission />,
    },
    {
      path: '/application',
      element: <Application />,
    },
    {
      path: '/offer',
      element: <Offer />,
    },
    {
      path: '/offer/create',
      element: <OfferCreate />,
    },
    {
      path: '/offer/read/:id',
      element: <OfferRead />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
}
