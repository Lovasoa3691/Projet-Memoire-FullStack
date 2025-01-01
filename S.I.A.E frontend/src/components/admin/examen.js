import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function ExamenContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        {
            name: "ID_EXAM",
            selector: row => row.ID_EXAM,
            sortable: true,
        },
        {
            name: "CODE_EXAM",
            selector: row => row.CODE_EXAM,
            sortable: true,
        },
        {
            name: "DATE_EXAM",
            selector: row => row.DATE_EXAM,
            sortable: true,
        },
        {
            name: "HEURE_DEBUT",
            selector: row => row.HEURE_DEBUT,
            sortable: true,
        },
        {
            name: "HEURE_FIN",
            selector: row => row.HEURE_FIN,
            sortable: true,
        },
        {
            name: "MATIERE",
            selector: row => row.MATIERE,
            sortable: true,
        },
        {
            name: "DUREE",
            selector: row => row.DUREE,
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
    const [examData, setExamData] = useState([]);

    const generateMentions = (categories, levels) => {
        return categories.flatMap(category =>
            levels.map(level => ({ code: `${category}${level}` }))
        );
    };

    const [mention, setMention] = useState(
        generateMentions(["INFO", "BTP", "DROIT", "GM", "ICJ"], [1, 2, 3, 4, 5])
    );

    const paginationComponentOptions = {
        rowsPerPageText: "Lignes par page",
        rangeSeparatorText: "de",
        noRowsPerPage: false, // Cacher l'option "rows per page" si souhaité
        selectAllRowsItem: true,
        selectAllRowsItemText: "Tout",
    };



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
                setExamData(rep.data);
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
                    <h3 className="fw-bold mb-3">Liste des sessions d'examens mises en place</h3>
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
                                        Creer Session
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
                                                                <label>Code Examen</label>
                                                                <select name='codeExam'
                                                                    className="form-select"
                                                                >
                                                                    <option selected disabled>Choisir...</option>
                                                                    <option>EXAM.S1</option>
                                                                    <option>EXAM.S2</option>
                                                                    <option>EXAM.S3</option>
                                                                    <option>EXAM.S4</option>
                                                                    <option>EXAM.S5</option>
                                                                    <option>EXAM.S6</option>
                                                                    <option>EXAM.S7</option>
                                                                    <option>EXAM.S8</option>
                                                                    <option>EXAM.S9</option>
                                                                    <option>EXAM.S10</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div class="form-group">
                                                                <label>Date de l'examen</label>
                                                                <input
                                                                    type="date"
                                                                    className="form-control"
                                                                    name="dateExam"
                                                                    placeholder="Enter Email"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 pe-0">
                                                            <div className="form-group">
                                                                <label>Heure debut</label>
                                                                <input
                                                                    name="heureDebut"
                                                                    type="time"
                                                                    className="form-control"
                                                                    placeholder="fill position"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Heure fin</label>
                                                                <input
                                                                    name="heureFin"
                                                                    type="time"
                                                                    className="form-control"
                                                                    placeholder="fill office"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Matiere</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="matiere"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label>Duree</label>
                                                                <select
                                                                    name="dureeExam"
                                                                    className="form-select"
                                                                >
                                                                    <option>1</option>
                                                                    <option>2</option>
                                                                    <option>3</option>
                                                                    <option>4</option>
                                                                    <option>5</option>
                                                                    <option>6</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* <div className="col-sm-12">
                                                            <div className="form-group">
                                                                <label className="form-label">Mention cible</label>
                                                                <div className="selectgroup selectgroup-pills">
                                                                    {mention.map(item => (
                                                                        <label className="selectgroup-item" key={item.code}>
                                                                            <input
                                                                                type="checkbox"
                                                                                name="value"
                                                                                value="HTML"
                                                                                className="selectgroup-input"
                                                                                checked=""
                                                                            />
                                                                            <span className="selectgroup-button">{item.code}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div> */}
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
                                        data={examData}
                                        pagination
                                        highlightOnHover
                                        noDataComponent="Aucune donnee disponible"
                                        paginationComponentOptions={paginationComponentOptions}
                                        // striped
                                        subHeader
                                        subHeaderComponent={
                                            <input
                                                type='text'
                                                placeholder='Recherche'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}

                                                style={{
                                                    padding: '7px',
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

export default ExamenContent;