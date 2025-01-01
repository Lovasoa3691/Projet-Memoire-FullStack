import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function PaiementContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        {
            name: "ID_PAIE",
            selector: row => row.ID_EXAM,
            sortable: true,
        },
        {
            name: "MONTANT",
            selector: row => row.CODE_EXAM,
            sortable: true,
        },
        {
            name: "TYPE_PAIE",
            selector: row => row.DATE_EXAM,
            sortable: true,
        },
        {
            name: "DATE_PAIE",
            selector: row => row.HEURE_DEBUT,
            sortable: true,
        },
        {
            name: "MODE_PAIE",
            selector: row => row.HEURE_FIN,
            sortable: true,
        },
        {
            name: "STATUT",
            selector: row => row.MATIERE,
            sortable: true,
        },
        // {
        //     name: "ACTION",
        //     cell: (row) => (
        //         <div className="form-button-action">
        //             <button className="btn btn-primary btn-sm">
        //                 <i className="fa fa-edit"></i>
        //             </button>
        //             &nbsp; &nbsp;
        //             <button className="btn btn-danger btn-sm">
        //                 <i className="fa fa-trash"></i>
        //             </button>
        //         </div>
        //     )

        // },
    ];


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [paieData, setpaieData] = useState([]);



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
                setpaieData(rep.data);
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
                    <h3 className="fw-bold mb-3">Liste des paiements</h3>
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
                                        Nouveau Paiement
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
                                                                <label>Nom et Prenom de l'etudiant</label>
                                                                <select name='matricule'
                                                                    className="form-select"
                                                                >
                                                                    <option selected disabled>Choisir...</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Type de paiement</label>
                                                                <select name='typePaie'
                                                                    className="form-select"
                                                                >
                                                                    <option>Frais de formation</option>
                                                                    <option>Droit d'examen</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="form-group">
                                                                <label>Motif</label>
                                                                <select name='motifPaie'
                                                                    className="form-select"
                                                                >
                                                                    <option>FF1</option>
                                                                    <option>FF2</option>
                                                                    <option>FF3</option>
                                                                    <option>FF4</option>
                                                                    <option>FF5</option>
                                                                    <option>FF6</option>
                                                                    <option>FF7</option>
                                                                    <option>FF8</option>
                                                                    <option>FF9</option>
                                                                    <option>FF10</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div class="form-group">
                                                                <label>Montant a paye</label>
                                                                <div class="input-group mb-3">
                                                                    <span class="input-group-text">Ar</span>
                                                                    <input
                                                                        type="text"
                                                                        class="form-control"
                                                                        aria-label="Amount (to the nearest dollar)"
                                                                    />
                                                                    <span class="input-group-text">.00</span>
                                                                </div>
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
                                        data={paieData}
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

export default PaiementContent;