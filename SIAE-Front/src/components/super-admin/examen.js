import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import api from '../API/api';
import swal from 'sweetalert';

function ExamenContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        {
            name: "IDENTIFIANT",
            selector: row => row.idExam,
            sortable: true,
        },
        {
            name: "SESSION",
            selector: row => row.codeExam,
            sortable: true,
        },
        {
            name: "DATE",
            selector: row => row.dateExam,
            sortable: true,
        },
        {
            name: "MATIERE",
            selector: row => row.matiere,
            sortable: true,
        },
        {
            name: "HORAIRE",
            selector: row => (
                <span className='text-center'>{row.heureDebut} - {row.heureFin}</span>
            ),
            sortable: true,
        },
        {
            name: "CLASSE",
            selector: row => (
                <span>[ {row.classe.join(", ")} ]</span>
            ),
            sortable: true,
        },
        {
            name: "STATUT",
            selector: row => (
                <span className={row.statut === "En cours" ? "badge badge-warning" : row.statut === "Termine" ? "badge badge-primary" : "badge badge-danger"}>
                    {row.statut}
                </span>
            ),
            sortable: true,
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div className="form-button-action" style={{ fontWeight: 'normal', fontSize: '20px' }}>

                    <i className="fas fa-file-alt text-primary"
                        onClick={() => afficherListeEtudiantInscrit(row)}
                        title="Inscriptions"
                    ></i>

                </div>
            )
        },
    ];


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [examData, setExamData] = useState([]);

    const paginationComponentOptions = {
        rowsPerPageText: "Lignes par page",
        rangeSeparatorText: "de",
        noRowsPerPage: false, // Cacher l'option "rows per page" si souhaité
        selectAllRowsItem: true,
        selectAllRowsItemText: "Tout",
    };

    const chargerExamens = () => {

        api.get('/examens/all')
            .then((rep) => {
                setExamData(rep.data.examens);
                // setFiltre(rep.data);
            })
            .catch(error => {
                console.log("Erreur lors de la recuperation des donnees: ", error);
            })
    };

    useEffect(() => {
        chargerExamens();
    }, []);

    const [isVisibleList, setVisibleList] = useState(false);


    const [etudiantIsncrit, setEtudiantInscrit] = useState([]);

    const [matiere, setMatiere] = useState('');
    const [session, setSession] = useState('');

    const afficherListeEtudiantInscrit = (data) => {
        setMatiere(data.matiere)
        setSession(data.codeExam)
        try {
            api.get(`/inscriptions/${data.idExam}`)
                .then((rep) => {
                    setEtudiantInscrit(rep.data)
                })
                .catch((error) => {
                    console.log(error.message)
                })
            setVisibleList(true);
        } catch (error) {
            console.log(error.message)
        }
    }

    const closeListModal = () => {
        setVisibleList(false);
    }

    return (
        <div className="container">

            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Liste des sessions d'examens mises en place</h3>
                </div>

                {/* Liste etudiants inscrits a l'examen */}
                {
                    isVisibleList && (
                        <div
                            className="modal fade show d-block"
                            id="addRowModal"
                            // tabindex="-1"
                            role="dialog"
                            aria-hidden="true"
                        >

                            <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                                <div className="modal-content">
                                    <div className="modal-header border-0">
                                        <h5 className="modal-title">
                                            <span className="fw-mediumbold"> </span>
                                            <span className="fw-light"> Liste des etudiants inscrites a l'examen {matiere} du session {session} </span>
                                        </h5>
                                        <i className='fas fa-times fa-2x text-danger' onClick={closeListModal}></i>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="table-responsive">
                                                <div className="col-md-12">

                                                    {/* <div className="card"> */}
                                                    {/* <div className="card-header">
                                                                        <div className="card-title">Journal de mes examens</div>
                                                                    </div> */}
                                                    <div className="card-body">
                                                        <table className="table table-bordered table-head-bg-info table-bordered-bd-info mt-4">
                                                            <thead>
                                                                <tr className='text-center'>
                                                                    <th scope='col'>Matricule</th>
                                                                    <th scope="col">Nom & Prenom</th>
                                                                    <th scope="col">Mention</th>
                                                                    <th scope="col">Niveau</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-center'>
                                                                {
                                                                    etudiantIsncrit && etudiantIsncrit.length > 0 ? (
                                                                        etudiantIsncrit.map(item => (
                                                                            <tr key={item.matricule}>
                                                                                <td>{item.matricule}</td>
                                                                                <td>{item.nomEtu} {item.prenomEtu}</td>
                                                                                <td>{item.mention}</td>
                                                                                <td>{item.niveau}</td>
                                                                            </tr>
                                                                        ))
                                                                    ) : (
                                                                        <div className='text-center'>Aucun etudiant inscrit</div>
                                                                    )
                                                                }

                                                            </tbody>
                                                        </table>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-border"
                                        >
                                            <i className='fas fa-print'></i> &nbsp;&nbsp;
                                            Imprimer
                                        </button>

                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                }

                {
                    isVisibleList && (
                        <div className="modal-backdrop fade show"></div>
                    )
                }


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    {/* <h4 className="card-title">Add Row</h4> */}
                                    <input
                                        type='text'
                                        placeholder='Recherche'
                                        className='ms-auto'
                                        // value={search}
                                        // onChange={(e) => setSearch(e.target.value)}

                                        style={{
                                            padding: '7px',
                                            width: '300px',
                                            fontSize: '16px',
                                            border: '1px solid #ddd',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="card-body">

                                <div className="table-responsive">
                                    <DataTable
                                        className="table table-hover"
                                        columns={colonne}
                                        data={examData}
                                        pagination
                                        highlightOnHover
                                        noDataComponent="Aucune donnee disponible"
                                        paginationComponentOptions={paginationComponentOptions}
                                        // striped
                                        // subHeader
                                        // subHeaderComponent={

                                        // }

                                        customStyles={{
                                            rows: {
                                                style: {
                                                    backgroundColor: '#f8f9fa',
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: '#e9ecef'
                                                    },
                                                }
                                            },
                                            headCells: {
                                                style: {
                                                    backgroundColor: '#343a40',
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center'
                                                },
                                            },
                                            cells: {
                                                style: {
                                                    textAlign: 'center',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ExamenContent;