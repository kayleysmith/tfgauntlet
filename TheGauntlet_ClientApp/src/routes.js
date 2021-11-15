import ListStates from './components/ListStates.vue'
import StatePage from './components/StatePage.vue'

export default [
    {path:'/',component: ListStates},
    {path:'/:id',component: StatePage}
]