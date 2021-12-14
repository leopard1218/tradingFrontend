// ** React Imports
import { Suspense, useContext, lazy } from 'react'

// ** Utils
import { isUserLoggedIn } from '@utils'
import { useLayout } from '@hooks/useLayout'
import { AbilityContext } from '@src/utility/context/Can'
import { useRouterTransition } from '@hooks/useRouterTransition'

// ** Custom Components
// import Spinner from '@components/spinner/Loading-spinner' // Uncomment if your require content fallback
import LayoutWrapper from '@layouts/components/layout-wrapper'

// ** Router Components
import { BrowserRouter as AppRouter, Route, Switch, Redirect } from 'react-router-dom'

// ** Routes & Default Routes
import { DefaultRoute, Routes } from './routes'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'

import Statistics from '../views/pages/Statistics'
import LoginForm from '../components/LoginForm'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import Home from '../views/pages/Home'
import Products from '../views/pages/Products'
import Company from '../views/pages/Company'
import Milestones from '../views/pages/Milestones'
import Institutional from '../views/pages/Institutional'
import EmailSent from '../views/pages/EmailSent'
import Verification from '../views/pages/Verification'
import ResetPassword from '../views/pages/ResetPassword'
import Account from '../views/pages/Account'
import Admin from '../views/pages/Admin'

const Router = () => {
  // ** Hooks
  const [layout, setLayout] = useLayout()
  const [transition, setTransition] = useRouterTransition()

  // ** ACL Ability Context
  const ability = useContext(AbilityContext)

  // ** Default Layout
  const DefaultLayout = layout === 'vertical' ? 'VerticalLayout' : 'HorizontalLayout'

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout }

  // ** Current Active Item
  const currentActiveItem = null

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = []
    const LayoutPaths = []

    if (Routes) {
      Routes.filter(route => {
        // ** Checks if Route layout or Default layout matches current layout
        if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
          LayoutRoutes.push(route)
          LayoutPaths.push(route.path)
        }
      })
    }

    return { LayoutRoutes, LayoutPaths }
  }

  const NotAuthorized = lazy(() => import('@src/views/pages/misc/NotAuthorized'))

  // ** Init Error Component
  const Error = lazy(() => import('@src/views/pages/misc/Error'))

  return (
    <AppRouter basename={process.env.REACT_APP_BASENAME}>
      <Switch>
        <Route path='/login' component={LoginForm} />
        <Route path='/forgotPassword' component={ForgotPasswordForm} />
        <Route
          exact
          path='/misc/not-authorized'
          render={props => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        <VerticalLayout>
            <Switch>
                {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}
                <Route exact path='/statistics' component={Statistics} />
                <Route exact path='/emailSent' component={EmailSent} />
                <Route exact path='/products' component={Products} />
                <Route exact path='/company' component={Company} />
                <Route exact path='/milestones' component={Milestones} />
                <Route exact path='/institutional' component={Institutional} />
                <Route exact path='/account' component={Account} />
                <Route exact path='/admin' component={Admin} />
                <Route exact path='/verification/:verifyCode' component={Verification} />
                <Route exact path='/resetPassword/:resetCode' component={ResetPassword} />
                <Route exact path='/' component={Home} />
                <Route path='*' component={Error} />              
            </Switch>
          </VerticalLayout>
        {/* NotFound Error page */}
        <Route exact path='*' component={Error} />
      </Switch>
    </AppRouter>
  )
}

export default Router
