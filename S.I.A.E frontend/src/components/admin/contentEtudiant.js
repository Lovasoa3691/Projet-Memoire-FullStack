import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function StudentContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        {
            name: "MATRICULE",
            selector: row => row.MATRICULE,
            sortable: true,
        },
        {
            name: "NOM",
            selector: row => row.NOM,
            sortable: true,
        },
        {
            name: "PRENOM",
            selector: row => row.PRENOM,
            sortable: true,
        },
        {
            name: "MENTION",
            selector: row => row.MENTION,
            sortable: true,
        },
        {
            name: "NIVEAU",
            selector: row => row.NIVEAU,
            sortable: true,
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div className="form-button-action">
                    <button className="btn btn-primary btn-sm" onClick={() => alert(row.MATRICULE)}>
                        <i className="fa fa-edit"></i>
                    </button>
                    &nbsp; &nbsp;
                    <button className="btn btn-danger btn-sm">
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            )

        },
    ];


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [EtuData, setEtuData] = useState([]);



    useEffect(() => {
        chargerEtudiants();
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

    const chargerEtudiants = () => {

        axios.get('http://localhost:5000/api/etudiants')
            .then((rep) => {
                // console.log(rep.data);
                setEtuData(rep.data);
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
                    <h3 className="fw-bold mb-3">Liste des etudiants</h3>
                </div>


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    {/* <h4 className="card-title">Add Row</h4> */}
                                    <button
                                        className="btn btn-primary btn-round ms-auto"
                                        data-bs-toggle="modal"
                                        data-bs-target="#addRowModal"
                                    >
                                        <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                        Ajouter Etudiant
                                    </button>
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
                                                {/* <p className="small">
                                                    Vous devraiz remplir tous les champs
                                                </p> */}
                                                <form>
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Nom</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="nomEtu"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div class="form-group">
                                                                <label>Prenom</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="prenomEtu"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 pe-0">
                                                            <div className="form-group">
                                                                <label>Adresse</label>
                                                                <input
                                                                    name="adresseEtu"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div class="form-group">
                                                                <label>Contact</label>
                                                                <div class="input-group mb-3">
                                                                    <span class="input-group-text" id="basic-addon3">+261</span>
                                                                    <input
                                                                        type="text"
                                                                        maxLength={7}
                                                                        class="form-control"
                                                                        name="contactEtu"
                                                                        aria-describedby="basic-addon3"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Mention</label>
                                                                <select
                                                                    name="mention"
                                                                    className="form-select"
                                                                >
                                                                    <option>DROIT</option>
                                                                    <option>BTP</option>
                                                                    <option>INFO</option>
                                                                    <option>GM</option>
                                                                    <option>ICJ</option>

                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Niveau</label>
                                                                <select
                                                                    name="niveau"
                                                                    className="form-select"
                                                                >
                                                                    <option>L1</option>
                                                                    <option>L2</option>
                                                                    <option>L3</option>
                                                                    <option>M1</option>
                                                                    <option>M2</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="modal-footer border-0">
                                                <button
                                                    type="button"
                                                    className="btn btn-success"
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
                                        data={EtuData}
                                        pagination
                                        highlightOnHover
                                        // striped
                                        subHeader
                                        subHeaderComponent={
                                            <input
                                                type='text'
                                                placeholder='Recherche'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}

                                                style={{
                                                    padding: '10px',
                                                    width: '300px',
                                                    fontSize: '16px',
                                                    border: '1px solid #ddd',
                                                }}
                                            />
                                        }

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

export default StudentContent;