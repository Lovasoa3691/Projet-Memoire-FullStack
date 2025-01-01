import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function UtilisateurContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        {
            name: "_ID",
            selector: row => row.ID_EXAM,
            sortable: true,
        },
        {
            name: "NOM_UT",
            selector: row => row.CODE_EXAM,
            sortable: true,
        },
        {
            name: "MAIL",
            selector: row => row.DATE_EXAM,
            sortable: true,
        },
        {
            name: "ROLE",
            selector: row => row.HEURE_DEBUT,
            sortable: true,
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div className="form-button-action">
                    <button className="btn btn-primary btn-sm">
                        <i className="fa fa-"></i>
                    </button>
                    &nbsp; &nbsp;
                    <button className="btn btn-danger btn-sm">
                        <i className="fa fa-times"></i>
                    </button>
                </div>
            )

        },
    ];


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [utilisateurData, setutilisateurData] = useState([]);



    useEffect(() => {
        // chargerExamens();
        // console.log(JSON.stringify(EtuData))
    }, []);

    // useEffect(() => {
    //     const filtrer = EtuData.filter(item =>
    //         item.MATRICULE.toLowerCase().includes(search.toLowerCase()) ||
    //         item.NOM.toLowerCase().includes(search.toLowerCase()) ||
    //         item.PRENOM.toLowerCase().includes(search.toLowerCase()) ||
    //         item.MENTION.toLowerCase().includes(search.toLowerCase()) ||
    //         item.NIVEAU.toLowerCase().includes(search.toLowerCase())
    //     );

    //     setFiltre(filtrer);
    // }, [search, EtuData]);

    const chargerExamens = () => {

        axios.get('http://localhost:5000/api/examens')
            .then((rep) => {
                // console.log(rep.data);
                setutilisateurData(rep.data);
                setFiltre(rep.data);
            })
            .catch(error => {
                console.log("Erreur lors de la recuperation des donnees: ", error);
            })


    };

    return (
        <div className="container">

            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Liste des utilisateurs</h3>
                </div>


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    {/* <h4 className="card-title">Add Row</h4> */}
                                    {/* <button
                                        className="btn btn-primary btn-round ms-auto"
                                        data-bs-toggle="modal"
                                        data-bs-target="#addRowModal"
                                    >
                                        <i className="fa fa-plus"></i>
                                        Creer Session
                                    </button> */}
                                </div>
                            </div>
                            <div className="card-body">

                                {/* <!-- Modal --> */}
                                <div
                                    className="modal fade"
                                    id="addRowModal"
                                    // tabindex="-1"
                                    role="dialog"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header border-0">
                                                <h5 className="modal-title">
                                                    <span className="fw-mediumbold"> Nouvelle</span>
                                                    <span className="fw-light"> Enregistrement </span>
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="close"
                                                    data-dismiss="modal"
                                                    aria-label="Close"
                                                >
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <p className="small">
                                                    Vous devraiz remplir tous les champs
                                                </p>
                                                <form>
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="form-group form-group-default">
                                                                <label>Name</label>
                                                                <input
                                                                    id="addName"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="fill name"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 pe-0">
                                                            <div className="form-group form-group-default">
                                                                <label>Position</label>
                                                                <input
                                                                    id="addPosition"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="fill position"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group form-group-default">
                                                                <label>Office</label>
                                                                <input
                                                                    id="addOffice"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="fill office"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer border-0">
                                                <button
                                                    type="button"
                                                    id="addRowButton"
                                                    className="btn btn-primary"
                                                >
                                                    Enregistrer
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    data-dismiss="modal"
                                                >
                                                    Fermer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                <div className="table-responsive">
                                    <DataTable
                                        className="table table-hover"
                                        columns={colonne}
                                        data={utilisateurData}
                                        pagination
                                        highlightOnHover
                                        // striped
                                        // subHeader
                                        // subHeaderComponent={
                                        //     <input
                                        //         type='text'
                                        //         placeholder='Recherche'
                                        //         value={search}
                                        //         onChange={(e) => setSearch(e.target.value)}

                                        //         style={{
                                        //             padding: '10px',
                                        //             width: '300px',
                                        //             fontSize: '16px',
                                        //             border: '1px solid #ddd',
                                        //         }}
                                        //     />
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

export default UtilisateurContent;