import session from 'express-session'

let taskListSession

taskListSession=session({
    secret:'mySecret',
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
})

export default taskListSession;