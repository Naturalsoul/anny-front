import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Alerts = withReactContent(Swal);

export default ({
    type = 'error',
    title,
    error,
    description = (
        <>
            Hubo un problema al intentar ingresar con Google. Favor de intentar de nuevo más tarde. Si el
            error persiste, envie una captura de pantalla de esta ventana junto a una reseña de lo que estaba haciendo
            al momento de que esta advertencia apareciera.
        </>
    ),
    colors = '#0DA694'
}) => Alerts.fire({
    type,
    title: <p>{ title }</p>,
    html: (
        <>
            <p className='text-justify'>
                {description}
            </p>
            <br />
            <b>
                {error}
            </b>
        </>
    ),
    confirmButtonText: 'Entendido!',
    confirmButtonColor: colors
});