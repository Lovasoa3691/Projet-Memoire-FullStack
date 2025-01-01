import React, { useEffect, useState } from 'react'
import axios from 'axios';
import swal from 'sweetalert';

function MyExamContent() {

    const [mesExamens, setMesExamens] = useState([]);

    useEffect(() => {
        chargerExamens();
    }, []);

    const chargerExamens = () => {

        const token = localStorage.getItem('token');
        if (token) {

            axios.get('http://localhost:5000/api/inscriptions', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((rep) => {
                    // console.log(rep.data);
                    // setMatriculeEtu(rep.data.etu['matricule']);
                    setMesExamens(rep.data);
                })
                .catch((error) => {
                    localStorage.removeItem('token');
                    console.log("Erreur lors de la recuperation des donnees: ", error);
                })
        }
    };


    const formatDate = (dateExam) => {
        const current = new Date(dateExam);
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0'); // Ajout de 1 car les mois commencent à 0
        const day = String(current.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`;
    };

    // const currentDateTime = getCurrentDateTime();

    // const [IdExam, setIdExam] = useState('');

    const handleDeleteExam = async (idInscription, event) => {

        const row = event.target.closest("tr")
        // setIdExam(row.getAttribute('data-key'));
        const cells = row.querySelectorAll("td")
        const statut = cells[5].textContent;

        // console.log(idExam);

        if (statut === "En cours") {
            swal("Desole ! Vous ne pouvez pas supprimer un examen en cours!", {
                title: 'Interruption',
                icon: "warning",
                buttons: {
                    confirm: {
                        className: "btn btn-success",
                    },
                },
            });
        } else {
            swal({
                title: "Etes-vous sur?",
                text: "Une fois supprime, vous ne pourrez plus recuperer ce fichier !",
                icon: "warning",
                buttons: {
                    confirm: {
                        text: "Oui",
                        className: "btn btn-success",
                    },
                    cancel: {
                        text: "Non",
                        visible: true,
                        className: "btn btn-danger"
                    }
                },
                // dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    axios.delete(`htpp://localhost:5000/api/inscription/${idInscription}`)
                        .then((rep) => {
                            if (rep.data.succes) {
                                swal(`Poof! ${rep.data.succes}`, {
                                    icon: "success",
                                    buttons: {
                                        confirm: {
                                            className: "btn btn-success",
                                        },
                                    },
                                });
                            } else {
                                swal(`${rep.data.message}`, {
                                    icon: "error",
                                    buttons: {
                                        confirm: {
                                            className: "btn btn-success",
                                        },
                                    },
                                });
                            }
                        })

                } else {
                    swal.close();
                }
            });
        }


    };

    return (
        <div className="container">

            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Calendriers de mes examens</h3>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">

                                <div className="table-responsive">
                                    <div className="col-md-12">

                                        {/* <div className="card"> */}
                                        <div className="card-header">
                                            <div className="card-title">Journal de mes examens</div>
                                        </div>
                                        <div className="card-body">

                                            <table className="table table-bordered table-head-bg-info table-bordered-bd-info mt-4">
                                                <thead>
                                                    <tr className='text-center'>
                                                        <th scope='col'>SESSION</th>
                                                        <th scope="col">DATE</th>
                                                        <th scope="col">MATIERE</th>
                                                        <th scope="col">HORAIRE</th>
                                                        <th scope="col">DUREE</th>
                                                        <th scope="col">STATUT</th>
                                                        <th scope='col'>ACTIONS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        mesExamens.map((ex) => (
                                                            <tr key={ex.mon_inscription._id} data-key={ex.mon_inscription._id} className='text-center fw-bold'>
                                                                <td>{ex.mon_examen.codeExam}</td>
                                                                <td>{formatDate(ex.mon_examen.dateExam)}</td>
                                                                <td>{ex.mon_examen.matiere}</td>
                                                                <td>{ex.mon_examen.heureDebut} - {ex.mon_examen.heureFin}</td>
                                                                <td>{ex.mon_examen.duree}</td>
                                                                <td>
                                                                    <span className={ex.mon_examen.statut === "Termine" ? "badge badge-primary fw-bold" : "badge badge-warning fw-bold"}>{ex.mon_examen.statut}</span>
                                                                </td>
                                                                <td>
                                                                    <i className='fa fa-times text-danger'
                                                                        onClick={(e) => handleDeleteExam(ex.mon_inscription._id, e)}
                                                                        style={{ fontSize: '20px', cursor: 'pointer' }}></i>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }


                                                </tbody>
                                            </table>
                                        </div>
                                        {/* </div> */}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MyExamContent;