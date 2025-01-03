import React, { useEffect, useState } from 'react'
import axios from 'axios';
import swal from 'sweetalert';
import NProgress from 'nprogress';
import api from '../API/api';

function ExamenContent() {

    const [examensDispo, setExamensDispo] = useState([]);
    const [matriculeEtu, setMatriculeEtu] = useState('')

    // useEffect(() => {
    //     chargerExamens();
    //     // console.log(JSON.stringify(EtuData))
    // }, []);

    useEffect(() => {
        // const token = localStorage.getItem('token');
        // if (token) {

        // axios.get('http://localhost:5000/api/examens', {
        //     headers: { Authorization: `Bearer ${token}` },
        // })
        api.get('/examens')
            .then((rep) => {
                // console.log(rep.data.examenTries);
                setMatriculeEtu(rep.data.etu['matricule']);
                setExamensDispo(rep.data.examenTries);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                console.log("Erreur lors de la recuperation des donnees: ", error);
            })
        // }
    }, []);

    const handleInscription = async (etudiantId, idExamen, dateExam) => {
        try {
            NProgress.start();

            const rep = await axios.post('http://localhost:5000/api/inscrire', {
                etudiantId, idExamen, dateExam
            });

            // console.log({ etudiantId, idExamen, dateExam })

            swal({
                title: "Verification en cours...",
                text: "Veuillez patienter s'il vous plait.",
                buttons: false,
                closeOnClickOutside: false,
                closeOnEsc: false
            });

            setTimeout(() => {
                NProgress.done();
                if (rep.data.erreur) {
                    swal("Erreur!", rep.data.erreur, "error");
                    // console.log(rep.data.paiementsManquantes)
                } else if (rep.data.succes) {
                    swal("Termine!", rep.data.succes, "success");
                } else {
                    swal("Erreur fatale!", rep.data.message, "error");
                }

            }, 2000);
        } catch (error) {

        }

    };

    const formatDate = (dateString) => {
        const date = new Date(dateString); // Conversion si nécessaire
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }


    return (
        <div className="container">

            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Liste des examens disponibles</h3>
                </div>

                <div className="row justify-content-center align-item-center">
                    <div className="col-md-12">

                        <div className="row justify-content-start align-items-center">

                            {
                                examensDispo.map((item) => (
                                    <div className="col-md-4 ps-md-0 pe-md-4" key={item.idExam}>
                                        <div className="card card-pricing card-pricing-focus">
                                            <div className="card-header">
                                                <h4 className="card-title">{item.codeExam}</h4>
                                                <div className="card-price">
                                                    <span className="text fw-bold text-secondary">{item.matiere}</span>
                                                    {/* <span className="text">JAVA IHM</span> */}
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <ul className="specification-list">
                                                    <li>
                                                        <span className="name-specification">Date de l'examen</span>
                                                        <span className="status-specification">{formatDate(item.dateExam)}</span>
                                                    </li>
                                                    <li>
                                                        <span className="name-specification">Heure debut</span>
                                                        <span className="status-specification">{item.heureDebut}</span>
                                                    </li>
                                                    <li>
                                                        <span className="name-specification">Heure fin</span>
                                                        <span className="status-specification">{item.heureFin}</span>
                                                    </li>
                                                    <li>
                                                        <span className="name-specification">Duree</span>
                                                        <span className="status-specification">{item.duree}</span>
                                                    </li>
                                                    {/* <li>
                                                <span className="name-specification">Live Support</span>
                                                <span className="status-specification">Yes</span>
                                            </li> */}
                                                </ul>
                                            </div>
                                            <div className="card-footer">
                                                <button onClick={() => handleInscription(matriculeEtu, item.idExam, item.dateExam)} className="btn btn-primary w-100">
                                                    <b>Inscrire</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }



                        </div>
                    </div>
                </div>
            </div>
        </div>

        // </div>
        // </div>
    );
}

export default ExamenContent;