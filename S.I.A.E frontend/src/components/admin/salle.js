import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function SalleContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        {
            name: "IDENTIFIANT",
            selector: row => row.ID,
            sortable: true,
        },
        {
            name: "NUM_SALLE",
            selector: row => row.NUM_SALLE,
            sortable: true,
        },
        {
            name: "CAPACITE",
            selector: row => row.CAPACITE,
            sortable: true,
        },
        {
            name: "LOCALISATION",
            selector: row => row.LOCALISATION,
            sortable: true,
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div className="form-button-action">
                    <button className="btn btn-primary btn-sm">
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
    const [salleData, setSalleData] = useState([]);



    useEffect(() => {
        chargerSalles();
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

    const chargerSalles = () => {

        axios.get('http://localhost:5000/api/salles')
            .then((rep) => {
                // console.log(rep.data);
                setSalleData(rep.data);
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
                    <h3 className="fw-bold mb-3">Liste des salles</h3>
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
                                        Nouveau Salle
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
                                                                <label>Capacite</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control"
                                                                    name="capacite"
                                                                    placeholder=""
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Numero de la salle</label>
                                                                <select
                                                                    name="numSalle"
                                                                    className="form-select"
                                                                >
                                                                    <option>SN1</option>
                                                                    <option>SN2</option>
                                                                    <option>SN3</option>
                                                                    <option>SN4</option>
                                                                    <option>SN5</option>
                                                                    <option>SN6</option>
                                                                    <option>SN7</option>
                                                                    <option>SN8</option>
                                                                    <option>SN9</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Localisation</label>
                                                                <select
                                                                    name="localisation"
                                                                    className="form-select"
                                                                >
                                                                    <option>Ree de chausse</option>
                                                                    <option>1ere Etage</option>
                                                                    <option>2eme Etage</option>

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
                                        data={salleData}
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

export default SalleContent;