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
            name: "ACTIONS",
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

    const generateMentions = (categories, levels) => {
        return categories.flatMap(category =>
            levels.map(level => ({ code: `${category} ${level}` }))
        );
    };


    const [mention1, setMention1] = useState(
        generateMentions(["INFO", "BTP", "DROIT", "GM", "ICJ"], ["L1"])
    );

    const [mention2, setMention2] = useState(
        generateMentions(["INFO", "BTP", "DROIT", "GM", "ICJ"], ["L2"])
    );

    const [mention3, setMention3] = useState(
        generateMentions(["INFO", "BTP", "DROIT", "GM", "ICJ"], ["L3"])
    );

    const [mention4, setMention4] = useState(
        generateMentions(["INFO", "BTP", "DROIT", "GM", "ICJ"], ["M1"])
    );

    const [mention5, setMention5] = useState(
        generateMentions(["INFO", "BTP", "DROIT", "GM", "ICJ"], ["M2"])
    );

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


    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState('');


    const [isVisible, setVisible] = useState(false);
    const [isVisibleList, setVisibleList] = useState(false);
    const [btnLabel, setBtnLabel] = useState('Enregistrer');
    const [isEdit, setIsEdit] = useState(false);

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
                                        subHeader
                                        subHeaderComponent={
                                            <input
                                                type='text'
                                                placeholder='Recherche'
                                                // value={search}
                                                // onChange={(e) => setSearch(e.target.value)}

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