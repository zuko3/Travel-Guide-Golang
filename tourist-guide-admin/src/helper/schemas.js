import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .min(4, 'Too Short!')
        .max(30, 'Too Long!')
        .required('Required'),
});

export const addPlacesSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    areas: Yup.string().required('Required'),
    lat: Yup.string().required('Required'),
    lon: Yup.string().required('Required'),
    tags: Yup.array().min(1, 'Required'),
    address: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    images: Yup.array().min(1, 'Required')
})

export const updatePlaceSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    areas: Yup.string().required('Required'),
    lat: Yup.string().required('Required'),
    lon: Yup.string().required('Required'),
    tags: Yup.array().min(1, 'Required'),
    address: Yup.string().required('Required'),
    description: Yup.string().required('Required')
})

export const addUserSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    password: Yup.string()
        .min(6, 'Password is too short - should be 6 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
        .required('No password provided.'),
    tags: Yup.array().min(1, 'Required'),
    email: Yup.string().email().required('Required')
})


export const EditserSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    password: Yup.string()
        .min(6, 'Password is too short - should be 6 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    tags: Yup.array().min(1, 'Required'),
    email: Yup.string().email().required('Required')
})


export const EditAdminSchema = Yup.object().shape({
    name: Yup.string().matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
    email: Yup.string().email(),
    password: Yup.string().min(6, 'Password is too short - should be 6 chars minimum.')
})