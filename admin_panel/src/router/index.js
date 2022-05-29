import Vue from 'vue';
import Router from 'vue-router';
import {getAuth, isLogged, notHasPermissions} from '../utils/auth';
// import Cookies from 'js-cookie';

// Users
import Users from '../views/users/index';
import User from '../views/users/show';
import Edit from '../views/users/edit';
import UserRoles from '../views/users/roles';
import mySubmissions from '../views/users/profile/submission.vue';
import myReservations from '../views/users/profile/reservation.vue';
import myEvaluations from '../views/users/profile/evaluation.vue';
import addEvaluations from '../views/users/profile/addevaluation.vue';
import myArchive from '../views/users/profile/archive.vue';
import showArchive from '../views/users/profile/showArchive';
import myOrganizations from '../views/users/profile/organization.vue';

//recovery
import Recoveries from '../views/managment/recoveries/index';
import userRecoveries from '../views/managment/recovery/index';
import Settings from '../views/managment/settings/index';

// management
import Management from '../views/managment/management';
import Roles from '../views/managment/roles/roles';
import Docs from '../views/managment/docs/docs';
import Logs from '../views/managment/logs/index';
import LogsShow from '../views/managment/logs/show';

import Tickets from '../views/managment/tickets/index';
import addTicket from '../views/managment/tickets/add';

import HEManagement from '../views/HE/management';
import Submissions from '../views/HE/submissions/index';
import Submission from '../views/HE/submissions/show';
import Group from '../views/HE/submissions/group';
import editSubmission from '../views/HE/submissions/edit';
import Council from '../views/HE/submissions/council';
import preCouncil from '../views/SC/submissions/council';
import editAdditionalData from '../views/HE/submissions/additionalData';
import editReport from '../views/HE/submissions/report/edit';

import Teams from '../views/HE/teams/index';
import Team from '../views/HE/teams/show';
import editTeam from '../views/HE/teams/edit';
import Hotels from '../views/HE/hotels/index';
import Hotel from '../views/HE/hotels/show';
import editHotel from '../views/HE/hotels/edit';
import servicesHotel from '../views/HE/hotels/services-edit';
import editReservation from '../views/HE/hotels/reservation';

import Forms from '../views/HE/forms/index';
import editForms from '../views/HE/forms/edit';
import Reservation from '../views/HE/hotels/details';

import Organizations from '../views/HE/organizations/index';
import Organization from '../views/HE/organizations/show';
import organizationEdit from '../views/HE/organizations/edit';
import departmentEdit from '../views/HE/organizations/department';
//OT
import TRManagement from '../views/TR/management';
//HE
import HigherSubsetting from '../views/HE/submissions/subsetting';

//SC
import SCManagement from '../views/SC/management';
import SCSubmissions from '../views/SC/submissions/index';
import SCSubmission from '../views/SC/submissions/show';
import SCeditSubmission from '../views/SC/submissions/edit';
import editSCAdditionalData from '../views/SC/submissions/additionalData';
import SCeditReport from '../views/SC/submissions/report/edit';
import Subsetting from '../views/SC/submissions/subsetting';
import Messages from '../views/SC/submissions/message';

//SC Team
import SCTeams from '../views/SC/teams/index';
import SCTeam from '../views/SC/teams/show';
import SCeditTeam from '../views/SC/teams/edit';

import Groups from '../views/SC/groups/index';
import GroupTag from '../views/SC/groups/show';

//SC Organization
import SCOrganizations from '../views/SC/organizations/index';
import SCOrganization from '../views/SC/organizations/show';
import SCorganizationEdit from '../views/SC/organizations/edit';

import Courses from '../views/TR/courses/index';
import Course from '../views/TR/courses/show';
import CoursesEdit from '../views/TR/courses/edit';

import Plans from '../views/TR/plans/index';
import Plan from '../views/TR/plans/show';
import PlansEdit from '../views/TR/plans/edit';
import PlansEditPayment from '../views/TR/plans/payment';
import Reservations from '../views/TR/reservations/index';
import ReservationPlan from '../views/TR/reservations/show';
import Stages from '../views/TR/setting/subsetting';
import TRForms from '../views/TR/forms/index';

import Places from '../views/TR/places/index';

//SC Forms
import SCForms from '../views/SC/forms/index';
import SCeditForms from '../views/SC/forms/edit';

//SC Document
import Documents from '../views/SC/documents/index';

//FS
import FHome from '../views/FS/management';
import Finances from '../views/FS/index';
import UFinances from '../views/FS/users';
import CFinances from '../views/FS/components/wallets';
import showWallet from '../views/FS/components/show';
import Finance from '../views/FS/show';

// Containers
import TheContainer from '../containers/TheContainer';
// Views
import Dashboard from '../views/Dashboard';

import Page500 from '../views/pages/Page500';
import Page404 from '../views/pages/Page404';
import Page401 from '../views/pages/page401';
import Login from '../views/pages/Login';
import Register from '../views/pages/Register';
import Recovery from '../views/pages/Recovery';
import NewPassword from '../views/pages/NewPassword';
import Reset from '../views/pages/Reset';
import Activation from '../views/pages/Activation';
import RecoveryActivation from '../views/pages/RecoveryActivation';
import Message from '../views/pages/ActivationMessage';
import ResetMessage from '../views/pages/ResetMessage';
import RecoveryMessage from '../views/pages/RecoveryMessage';

// archive
import archive from '../views/managment/archive/index';
import Editor from '../views/managment/archive/editor';

Vue.use(Router);

let router = new Router({
    mode: 'history',
    linkActiveClass: 'active',
    scrollBehavior: () => ({y: 0}),
    routes: configRoutes(),
});

// middleware
router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next('/404');
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (notHasPermissions()) {
            return next({
                path: '/401',
                params: {nextUrl: to.fullPath},
            });
        } else {
            next();
        }

        if (!isLogged()) {
            next({
                path: '/login',
                params: {nextUrl: to.fullPath},
            });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (!isLogged()) {
            next();
        } else {
            next('/');
        }
    } else {
        next();
    }
});

// Routes
function configRoutes() {
    return [
        {
            path: '/',
            redirect: '/dashboard',
            name: 'home',
            component: TheContainer,
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: Dashboard,
                },
                {
                    path: 'management',
                    meta: {
                        label: 'management',
                    },
                    component: {
                        render(c) {
                            return c('router-view');
                        },
                    },
                    children: [
                        {
                            path: '',
                            component: Management,
                        },
                        {
                            path: 'roles',
                            name: 'roles',
                            component: Roles,
                        },
                        {
                            path: 'recoveries',
                            name: 'recoveries',
                            component: Recoveries,
                        },
                        {
                            path: 'users/recoveries',
                            name: 'recoveries',
                            component: userRecoveries,
                        },
                        {
                            path: 'settings',
                            name: 'settings',
                            component: Settings,
                        },
                        {
                            path: 'tickets',
                            name: 'tickets',
                            component: Tickets,
                        },
                        {
                            path: 'ticket/add/:id?',
                            name: 'addTicket',
                            component: addTicket,
                        },
                        {
                            path: 'docs',
                            name: 'docs',
                            component: Docs,
                        },

                        {
                            path: 'logs/:id?/:type?',
                            name: 'logs',
                            component: Logs,
                        },
                        {
                            path: 'log/:id',
                            name: 'showLog',
                            component: LogsShow,
                        },
                        {
                            path: 'archive',
                            redirect: 'archive',
                            name: 'archive',
                            component: {
                                render(c) {
                                    return c('router-view');
                                },
                            },
                            children: [
                                {
                                    path: '/',
                                    component: archive,
                                },
                                {
                                    path: 'content',
                                    name: 'content',
                                    component: Editor,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: 'higher',
                    name: 'higherEducation',
                    component: {
                        render(c) {
                            return c('router-view');
                        },
                    },
                    children: [
                        {
                            path: '',
                            component: HEManagement,
                        },
                        {
                            path: 'submissions',
                            redirect: 'submissions',
                            name: 'submissions',
                            component: {
                                render(c) {
                                    return c('router-view');
                                },
                            },
                            children: [
                                {
                                    path: '/',
                                    name: 'submissions',
                                    component: Submissions,
                                },
                                {
                                    path: 'submission/:submission_id/:id',
                                    name: 'submission',
                                    component: Submission,
                                },
                                {
                                    path: 'group/:submission_id',
                                    name: 'submission',
                                    component: Group,
                                },
                                {
                                    path: 'edit/:id/:type',
                                    name: 'EditSubmission',
                                    component: editSubmission,
                                },
                                {
                                    path: 'council/:id',
                                    name: 'council',
                                    component: Council,
                                },

                                {
                                    path: 'Additional/edit/:id',
                                    name: 'editAdditionalData',
                                    component: editAdditionalData,
                                },
                                {
                                    path: 'add/:system',
                                    name: 'AddSubmission',
                                    component: editSubmission,
                                },
                                {
                                    path: 'submission/reports/edit/:evaluation_id/:id',
                                    name: 'editReport',
                                    component: editReport,
                                    props: true,
                                },
                            ],
                        },
                        {
                            path: 'teams',
                            name: 'teams',
                            component: Teams,
                        },
                        {
                            path: 'team/:id',
                            name: 'team',
                            component: Team,
                        },
                        {
                            path: 'subsetting',
                            name: 'subsetting',
                            component: HigherSubsetting,
                        },
                        {
                            path: 'messages/:submission_id/:id',
                            name: 'messages',
                            component: Messages,
                        },
                        {
                            path: 'team/edit/:id',
                            name: 'team',
                            component: editTeam,
                        },
                        {
                            path: 'team/new/add',
                            name: 'add_team',
                            component: editTeam,
                        },
                        {
                            path: 'forms',
                            name: 'forms',
                            component: Forms,
                        },
                        {
                            path: 'form/edit/:id',
                            name: 'forms',
                            component: editForms,
                        },
                        {
                            path: 'form/new/add',
                            name: 'add_form',
                            component: editForms,
                        },
                        {
                            path: 'hotels',
                            name: 'hotels',
                            component: Hotels,
                        },
                        {
                            path: 'hotel/:id',
                            name: 'hotel',
                            component: Hotel,
                        },
                        {
                            path: 'hotel/edit/:id',
                            name: 'hotel',
                            component: editHotel,
                        },
                        {
                            path: 'hotel/servicesedit/:id',
                            name: 'servicesedit',
                            component: servicesHotel,
                        },
                        {
                            path: 'reservation/edit/:id/:reservation_id?',
                            name: 'reservation',
                            component: editReservation,
                        },
                        {
                            path: 'hotel/new/add',
                            name: 'addHotel',
                            component: editHotel,
                        },
                        {
                            path: 'hotel/reservation/:id',
                            name: 'reservation',
                            component: Reservation,
                        },
                        {
                            path: 'organizations',
                            name: 'organizations',
                            component: Organizations,
                        },
                        {
                            path: 'organization/:id',
                            name: 'organization',
                            component: Organization,
                        },
                        {
                            path: 'organization/edit/:id',
                            name: 'organization',
                            component: organizationEdit,
                        },
                        {
                            path: 'organization/department/edit/:id?',
                            name: 'departments',
                            component: departmentEdit,
                        },
                        {
                            path: 'organization/new/add',
                            name: 'add_organization',
                            component: organizationEdit,
                        },
                    ],
                },
                {
                    path: 'school',
                    name: 'SchoolSystem',
                    component: {
                        render(c) {
                            return c('router-view');
                        },
                    },
                    children: [
                        {
                            path: '',
                            component: SCManagement,
                        },
                        {
                            path: 'submissions',
                            redirect: 'submissions',
                            name: 'submissions',
                            component: {
                                render(c) {
                                    return c('router-view');
                                },
                            },
                            children: [
                                {
                                    path: '/',
                                    component: SCSubmissions,
                                    name: 'submissions',
                                },
                                {
                                    path: 'submission/:submission_id/:id',
                                    name: 'submission',
                                    component: SCSubmission,
                                },
                                {
                                    path: 'council/:id',
                                    name: 'council',
                                    component: preCouncil,
                                },
                                {
                                    path: 'edit/:ev_id?/:id/:type',
                                    name: 'EditSubmission',
                                    component: SCeditSubmission,
                                },
                                {
                                    path: 'add/:type',
                                    name: 'AddSubmission',
                                    component: SCeditSubmission,
                                },
                                {
                                    path: 'Additional/edit/:id/:type/:system',
                                    name: 'editAdditionalData',
                                    component: editSCAdditionalData,
                                },
                                {
                                    path: 'submission/reports/edit/:evaluation_id/:id',
                                    name: 'editPreReport',
                                    component: SCeditReport,
                                    props: true,
                                },
                            ],
                        },
                        {
                            path: 'groups',
                            redirect: 'groups',
                            name: 'groups',
                            component: {
                                render(c) {
                                    return c('router-view');
                                },
                            },
                            children: [
                                {
                                    path: '/',
                                    name: 'groups',
                                    component: Groups,
                                },
                                {
                                    path: 'group/:id',
                                    name: 'group',
                                    component: GroupTag,
                                },
                            ],
                        },
                        {
                            path: 'teams',
                            name: 'teams',
                            component: SCTeams,
                        },
                        {
                            path: 'team/:id',
                            name: 'team',
                            component: SCTeam,
                        },
                        {
                            path: 'team/edit/:id',
                            name: 'team',
                            component: SCeditTeam,
                        },
                        {
                            path: 'team/new/add',
                            name: 'add_team',
                            component: SCeditTeam,
                        },
                        {
                            path: 'forms',
                            name: 'forms',
                            component: SCForms,
                        },
                        {
                            path: 'form/edit/:id',
                            name: 'forms',
                            component: SCeditForms,
                        },
                        {
                            path: 'form/new/add',
                            name: 'add_form',
                            component: SCeditForms,
                        },
                        {
                            path: 'documents',
                            name: 'documents',
                            component: Documents,
                        },
                        {
                            path: 'subsetting',
                            name: 'subsetting',
                            component: Subsetting,
                        },
                        {
                            path: 'messages/:submission_id/:id',
                            name: 'messages',
                            component: Messages,
                        },
                        {
                            path: 'hotel/reservation/:id',
                            name: 'reservation',
                            component: Reservation,
                        },
                        {
                            path: 'organizations',
                            name: 'organizations',
                            component: SCOrganizations,
                        },

                        {
                            path: 'organization/:id',
                            name: 'organization',
                            component: SCOrganization,
                        },
                        {
                            path: 'organization/edit/:id',
                            name: 'organization',
                            component: SCorganizationEdit,
                        },
                        {
                            path: 'organization/new/add/:removed?',
                            name: 'add_organization',
                            component: SCorganizationEdit,
                        },
                    ],
                },
                {
                    path: 'course',
                    name: 'trainingSystem',
                    component: {
                        render(c) {
                            return c('router-view');
                        },
                    },
                    children: [
                        {
                            path: '',
                            component: TRManagement,
                        },
                        {
                            path: 'courses',
                            redirect: 'courses',
                            name: 'courses',
                            component: {
                                render(c) {
                                    return c('router-view');
                                },
                            },
                            children: [
                                {
                                    path: '/',
                                    component: Courses,
                                    name: 'coursesSettings',
                                },
                                {
                                    path: 'show/:id',
                                    name: 'course',
                                    component: Course,
                                },
                            ],
                        },
                        {
                            path: 'plans',
                            redirect: 'plans',
                            name: 'plans',
                            component: {
                                render(c) {
                                    return c('router-view');
                                },
                            },
                            children: [
                                {
                                    path: '/',
                                    name: 'plans',
                                    component: Plans,
                                },
                                {
                                    path: 'plan/:id',
                                    name: 'course',
                                    component: Plan,
                                },
                            ],
                        },
                        {
                            path: 'reservations',
                            name: 'subscriptionsTR',
                            component: Reservations,
                        },
                        {
                            path: 'places',
                            name: 'places',
                            component: Places,
                        },
                        {
                            path: 'reservations/reservation/:id',
                            name: 'reservations',
                            component: ReservationPlan,
                        },
                        {
                            path: 'courses/edit/:id',
                            name: 'edit',
                            component: CoursesEdit,
                        },
                        {
                            path: 'courses/add',
                            name: 'add',
                            component: CoursesEdit,
                        },
                        {
                            path: 'reservations/stage',
                            name: 'subsetting',
                            component: Stages,
                        },
                        {
                            path: 'tr/forms',
                            name: 'forms',
                            component: TRForms,
                        },
                        {
                            path: 'plans/add',
                            name: 'add',
                            component: PlansEdit,
                        },
                        {
                            path: 'plans/edit/:id',
                            name: 'edit',
                            component: PlansEdit,
                        },
                        {
                            path: 'plans/editpayment/:id',
                            name: 'edit',
                            component: PlansEditPayment,
                        },
                        {
                            path: 'teams',
                            name: 'teams',
                            component: SCTeams,
                        },
                        {
                            path: 'team/:id',
                            name: 'team',
                            component: SCTeam,
                        },
                        {
                            path: 'team/edit/:id',
                            name: 'team',
                            component: SCeditTeam,
                        },
                        {
                            path: 'team/new/add',
                            name: 'add_team',
                            component: SCeditTeam,
                        },
                        {
                            path: 'forms',
                            name: 'forms',
                            component: SCForms,
                        },
                        {
                            path: 'form/edit/:id',
                            name: 'forms',
                            component: SCeditForms,
                        },
                        {
                            path: 'form/new/add',
                            name: 'add_form',
                            component: SCeditForms,
                        },
                        {
                            path: 'documents',
                            name: 'documents',
                            component: Documents,
                        },
                        {
                            path: 'subsetting',
                            name: 'subsetting',
                            component: Subsetting,
                        },
                        {
                            path: 'messages/:submission_id/:id',
                            name: 'messages',
                            component: Messages,
                        },
                        {
                            path: 'hotel/reservation/:id',
                            name: 'reservation',
                            component: Reservation,
                        },
                        {
                            path: 'organizations',
                            name: 'organizations',
                            component: SCOrganizations,
                        },

                        {
                            path: 'organization/:id',
                            name: 'organization',
                            component: SCOrganization,
                        },
                        {
                            path: 'organization/edit/:id',
                            name: 'organization',
                            component: SCorganizationEdit,
                        },
                        {
                            path: 'organization/new/add/:removed?',
                            name: 'add_organization',
                            component: SCorganizationEdit,
                        },
                    ],
                },
                {
                    path: 'users',
                    meta: {
                        label: 'users',
                    },
                    component: {
                        render(c) {
                            return c('router-view');
                        },
                    },
                    children: [
                        {
                            path: '',
                            component: Users,
                        },
                        {
                            path: ':id',
                            name: 'userDetails',
                            component: User,
                        },
                        {
                            path: 'user/submission/:id/:system',
                            name: 'submission',
                            component: mySubmissions,
                        },
                        {
                            path: 'user/reservation/:id/:system',
                            name: 'reservation',
                            component: myReservations,
                        },
                        {
                            path: 'user/organization/:id/:system',
                            name: 'organization',
                            component: myOrganizations,
                        },
                        {
                            path: 'user/evaluations/:id/:team_id?',
                            name: 'evaluations',
                            component: myEvaluations,
                        },
                        {
                            path: 'user/evaluation/add/:submission_id?/:id?',
                            name: 'addevaluations',
                            component: addEvaluations,
                        },
                        {
                            path: 'user/archives/:id',
                            name: 'archive',
                            component: myArchive,
                        },
                        {
                            path: 'user/archives/archive/:id',
                            name: 'archive',
                            component: showArchive,
                        },
                        {
                            path: 'user/edit/:id',
                            name: 'editUser',
                            component: Edit,
                        },
                        {
                            path: 'user/add',
                            name: 'addUser',
                            component: Edit,
                        },
                        {
                            path: 'user/roles/:id',
                            name: 'user_role',
                            component: UserRoles,
                        },
                    ],
                },
                {
                    path: 'finance',
                    name: 'financeSystem',
                    component: {
                        render(c) {
                            return c('router-view');
                        },
                    },
                    children: [
                        {
                            path: '',
                            component: FHome,
                        },
                        {
                            path: 'index/:system',
                            component: Finances,
                        },
                        {
                            path: 'users/:user_id?',
                            component: UFinances,
                        },
                        {
                            path: 'wallet',
                            name: "wallet",
                            component: CFinances,
                        },
                        // {
                        //   path: 'wallet',
                        //   name:"wallet",
                        //   component: CFinances,
                        //   // component: {
                        //   //   render(c) {
                        //   //     return c('router-view');
                        //   //   },
                        //   // },
                        //   children: [
                        //     {
                        //       path: 'show/:system?/:id?',
                        //       name:"wallet",
                        //       component: showWallet,
                        //     }
                        //   ]
                        // },
                        {
                            path: 'wallet/show/:id?',
                            name: 'wallet',
                            component: showWallet,
                        },
                        {
                            path: 'show/:system/:id',
                            component: Finance,
                        },
                    ],
                },
            ],
        },
        {
            path: '/',
            redirect: '/login',
            name: 'Pages',
            component: {
                render(c) {
                    return c('router-view');
                },
            },
            children: [
                {
                    path: '404',
                    name: 'Page404',
                    component: Page404,
                },
                {
                    path: '401',
                    name: 'Page401',
                    component: Page401,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: '500',
                    name: 'Page500',
                    component: Page500,
                },
                {
                    path: 'login/:code?',
                    name: 'Login',
                    component: Login,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: Register,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'recovery/:type?',
                    name: 'Recovery',
                    component: Recovery,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'activation/:token',
                    name: 'Activation',
                    component: Activation,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'recoveryactivation/:token',
                    name: 'RecoveryActivation',
                    component: RecoveryActivation,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'message',
                    name: 'Activation Message',
                    component: Message,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'resetmessage',
                    name: 'Reset Message',
                    component: ResetMessage,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'recovarymessage',
                    name: 'Recovery Message',
                    component: RecoveryMessage,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'reset',
                    name: 'Reset',
                    component: Reset,
                    meta: {
                        guest: true,
                    },
                },
                {
                    path: 'newpassword/:token',
                    name: 'NewPassword',
                    component: NewPassword,
                    meta: {
                        guest: true,
                    },
                },
            ],
        },
    ];
}

export default router;
