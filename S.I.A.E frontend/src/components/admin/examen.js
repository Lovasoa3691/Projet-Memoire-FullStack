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
                    &nbsp;&nbsp;&nbsp;
                    <i className="fas fa-pen"
                        onClick={() => openModalEdit(row)}
                        title="Editer"
                    ></i>
                    &nbsp;&nbsp;
                    <i className="fas fa-trash-alt text-danger"
                        onClick={() => supprimeExamen(row)}
                        title="Supprimer"
                    ></i>
                    &nbsp;&nbsp;

                    {row.statut === 'En cours' && (
                        <i className="fas fa-times-circle text-warning"
                            onClick={() => annulerExamen(row)}
                            title="Annuler"
                        ></i>
                    )}
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

    const [examenForm, setExamenForm] = useState({
        idExam: '',
        codeExam: '',
        dateExam: '',
        classe: [],
        heureDebut: '',
        heureFin: '',
        matiere: ''
        , duree: '',
        admin: '',
    })

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

    const saveExamen = (e) => {
        e.preventDefault();
        // console.log(examenForm)
        api.post('/examens/save', examenForm)
            .then((rep) => {
                // console.log(rep.data)
                if (rep.data.succes) {
                    setVisible(false)
                    swal({
                        text: `${rep.data.message}`,
                        icon: "success",
                        buttons: false,
                        timer: 1500
                    },
                    )
                }
                else {
                    swal({
                        text: `${rep.data.message}`,
                        icon: "error",
                        buttons: false,
                        timer: 1500
                    },
                    )
                }
                setVisible(false)
                chargerExamens();
            })
            .catch((err) => {
                console.log("Erreur: ", err.message)
            })
    }

    const updateSalle = (e) => {
        e.preventDefault();
        api.put(`/examens/update/${examenForm.idExam}`, examenForm)
            .then((rep) => {
                if (rep.data.succes) {
                    swal({
                        text: `${rep.data.message}`,
                        icon: "success",
                        buttons: false,
                        timer: 1500
                    },
                    )
                }
                else {
                    swal({
                        text: `${rep.data.message}`,
                        icon: "error",
                        buttons: false,
                        timer: 1500
                    },
                    )
                }
                chargerExamens();
            })
            .catch((err) => {
                console.log("Erreur: ", err.message)
            })
    }

    const annulerExamen = (data) => {

        swal({
            title: "Annulation",
            text: "Vous etes sur de vouloir annule cet examen ?",
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
                api.put(`/examens/update/statut/${data.idExam}`)
                    .then((rep) => {
                        if (rep.data.succes) {
                            swal({
                                text: `${rep.data.message}`,
                                icon: "success",
                                buttons: false,
                                timer: 1500
                            },
                            )
                        }
                        else {
                            swal({
                                text: `${rep.data.message}`,
                                icon: "error",
                                buttons: false,
                                timer: 1500
                            },
                            )
                        }
                        chargerExamens();
                    })
                    .catch((err) => {
                        console.log("Erreur: ", err.message)
                    })

            } else {
                swal.close();
            }
        });

    }

    const supprimeExamen = (data) => {
        if (data.statut === "En cours") {
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
                    api.delete(`examens/delete/${data.idExam}`)
                        .then((rep) => {
                            if (rep.data.succes) {
                                swal(`${rep.data.message}`, {
                                    icon: "success",
                                    buttons: {
                                        confirm: {
                                            className: "btn btn-success",
                                        },
                                    },
                                });
                                chargerExamens();
                            } else {
                                swal(`${rep.data.message}`, {
                                    icon: "error",
                                    buttons: {
                                        confirm: {
                                            className: "btn btn-success",
                                        },
                                    },
                                });
                                chargerExamens();
                            }
                        })

                } else {
                    swal.close();
                }
            });
        }
    }

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState('');


    const [isVisible, setVisible] = useState(false);
    const [isVisibleList, setVisibleList] = useState(false);
    const [btnLabel, setBtnLabel] = useState('Enregistrer');
    const [isEdit, setIsEdit] = useState(false);

    const [etudiantIsncrit, setEtudiantInscrit] = useState([]);

    const [matiere, setMatiere] = useState('');
    const [session, setSession] = useState('');

    const viderChamp = () => {
        examenForm.idExam = ''
        examenForm.codeExam = ''
        examenForm.dateExam = ''
        examenForm.classe = []
        examenForm.heureDebut = ''
        examenForm.heureFin = ''
        examenForm.matiere = ''
        examenForm.duree = ''
    }

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

    const handleChangeData = (e) => {
        const { name, value } = e.target;
        setExamenForm({ ...examenForm, [name]: value });
    }


    const formatDate = (dateString) => {
        const date = new Date(dateString); // Conversion si nécessaire
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }


    const openModalEdit = (data) => {
        setVisible(true)
        setIsEdit(true);
        setBtnLabel('Mettre a jour');

        examenForm.idExam = data.idExam
        examenForm.codeExam = data.codeExam
        examenForm.dateExam = formatDate(data.dateExam)
        // examenForm.classe = data.classe
        examenForm.heureDebut = data.heureDebut
        examenForm.heureFin = data.heureFin
        examenForm.matiere = data.matiere
        examenForm.duree = data.duree
    }

    const openListModal = () => {
        setVisibleList(true);
    }

    const closeListModal = () => {
        setVisibleList(false);
    }

    const openModal = () => {
        setVisible(true);
        viderChamp();
        setBtnLabel('Enregistrer');
    }

    const closeModal = () => {
        setVisible(false);
        setIsEdit(false);
        viderChamp();
        setBtnLabel('Enregistrer');
    }

    const handleCheckChange = (value) => {
        setSelectedItems((prev) => {
            if (prev.includes(value)) {
                return prev.filter((item) => item !== value)
            } else {
                return [...prev, value]
            }
        });
    }

    const handleCheckChangeFinal = (value) => {
        setExamenForm((prev) => {
            const updtedClasse = prev.classe.includes(value) ?
                prev.classe.filter((item) => item !== value)
                : [...prev.classe, value];
            // if (prev.includes(value)) {
            //     return prev.filter((item) => item !== value)
            // } else {
            //     return [...prev, value]
            // }

            return { ...prev, classe: updtedClasse };
        });
    }

    const handleSelectChange = (e) => {
        setSelectedIndex(e.target.value);
        // examenForm.codeExam = e.target.value;
    }

    const [salleData, setSalleData] = useState([]);

    const chargerSalles = () => {
        try {
            api.get('/salles')
                .then((rep) => {
                    setSalleData(rep.data.salle)
                })
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        chargerSalles();
    }, []);

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
                                        onClick={openModal}
                                    // data-bs-toggle="modal"
                                    // data-bs-target="#addRowModal"
                                    >
                                        <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                        Creer Session
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">

                                {/* <!-- Modal --> */}

                                {
                                    isVisible && (
                                        <div
                                            className="modal fade show d-block"
                                            id="addRowModal"
                                            // tabindex="-1"
                                            role="dialog"

                                        >
                                            <form onSubmit={saveExamen}>
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header border-0">
                                                            <h5 className="modal-title">
                                                                <span className="fw-mediumbold"> Nouvelle</span>
                                                                <span className="fw-light"> Enregistrement </span>
                                                            </h5>
                                                            <i className='fas fa-times fa-2x text-danger' onClick={closeModal}></i>
                                                        </div>
                                                        <div className="modal-body">
                                                            {/* <p className="small">
                                                    Vous devraiz remplir tous les champs
                                                </p> */}

                                                            <div className="row">
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Code Examen</label>
                                                                        <select name='codeExam'
                                                                            className="form-select"
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.codeExam}
                                                                        >
                                                                            <option>Choisir...</option>
                                                                            <option value='S1' >S1</option>
                                                                            <option value='S2'>S2</option>
                                                                            <option value='S3'>S3</option>
                                                                            <option value='S4'>S4</option>
                                                                            <option value='S5'>S5</option>
                                                                            <option value='S6'>S6</option>
                                                                            <option value='S7'>S7</option>
                                                                            <option value='S8'>S8</option>
                                                                            <option value='S9'>S9</option>
                                                                            <option value='S10'>S10</option>
                                                                        </select>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>Salle</label>
                                                                        <select name='salleExam'
                                                                            className="form-select"
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.salleExam}
                                                                        >
                                                                            <option>Choisir...</option>
                                                                            {
                                                                                salleData.map(item => (
                                                                                    <option key={item.idSalle} value={item.idSalle}>{item.numSalle}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Date de l'examen</label>
                                                                        <input
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.dateExam}
                                                                            type="date"
                                                                            className="form-control"
                                                                            name="dateExam"

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 pe-0">
                                                                    <div className="form-group">
                                                                        <label>Heure debut</label>
                                                                        <input
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.heureDebut}
                                                                            name="heureDebut"
                                                                            type="time"
                                                                            className="form-control"

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label>Heure fin</label>
                                                                        <input
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.heureFin}
                                                                            name="heureFin"
                                                                            type="time"
                                                                            className="form-control"

                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Matiere</label>
                                                                        <input
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.matiere}
                                                                            type="text"
                                                                            className="form-control"
                                                                            name="matiere"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Duree</label>
                                                                        <input type="text"
                                                                            onChange={handleChangeData}
                                                                            value={examenForm.duree}
                                                                            className='form-control'
                                                                            name='duree'
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label className="form-label">Classe concernee</label>
                                                                        <div className="selectgroup selectgroup-pills">
                                                                            {
                                                                                examenForm.codeExam === "S1" || examenForm.codeExam === "S2" ? (
                                                                                    mention1 && mention1.map(item => (
                                                                                        <label className="selectgroup-item" key={item.code}>
                                                                                            <input
                                                                                                onChange={() => handleCheckChangeFinal(item.code)}
                                                                                                type="checkbox"
                                                                                                name="classe"
                                                                                                value={item.code}
                                                                                                className="selectgroup-input"
                                                                                                checked={examenForm.classe.includes(item.code)}
                                                                                            />
                                                                                            <span className="selectgroup-button">{item.code}</span>
                                                                                        </label>
                                                                                    )

                                                                                    )
                                                                                ) : examenForm.codeExam === "S3" || examenForm.codeExam === "S4" ? (
                                                                                    mention2 && mention2.map(item => (
                                                                                        <label className="selectgroup-item" key={item.code}>
                                                                                            <input
                                                                                                onChange={() => handleCheckChangeFinal(item.code)}
                                                                                                type="checkbox"
                                                                                                name="classe"
                                                                                                value={item.code}
                                                                                                className="selectgroup-input"
                                                                                                checked={examenForm.classe.includes(item.code)}
                                                                                            />
                                                                                            <span className="selectgroup-button">{item.code}</span>
                                                                                        </label>
                                                                                    )

                                                                                    )
                                                                                ) : examenForm.codeExam === "S5" || examenForm.codeExam === "S6" ? (
                                                                                    mention3 && mention3.map(item => (
                                                                                        <label className="selectgroup-item" key={item.code}>
                                                                                            <input
                                                                                                onChange={() => handleCheckChangeFinal(item.code)}
                                                                                                type="checkbox"
                                                                                                name="classe"
                                                                                                value={item.code}
                                                                                                className="selectgroup-input"
                                                                                                checked={examenForm.classe.includes(item.code)}
                                                                                            />
                                                                                            <span className="selectgroup-button">{item.code}</span>
                                                                                        </label>
                                                                                    )

                                                                                    )
                                                                                ) : examenForm.codeExam === "S7" || examenForm.codeExam === "S8" ? (
                                                                                    mention4 && mention4.map(item => (
                                                                                        <label className="selectgroup-item" key={item.code}>
                                                                                            <input
                                                                                                onChange={() => handleCheckChangeFinal(item.code)}
                                                                                                type="checkbox"
                                                                                                name="classe"
                                                                                                value={item.code}
                                                                                                className="selectgroup-input"
                                                                                                checked={examenForm.classe.includes(item.code)}
                                                                                            />
                                                                                            <span className="selectgroup-button">{item.code}</span>
                                                                                        </label>
                                                                                    )

                                                                                    )
                                                                                ) : (
                                                                                    mention5 && mention5.map(item => (
                                                                                        <label className="selectgroup-item" key={item.code}>
                                                                                            <input
                                                                                                onChange={() => handleCheckChangeFinal(item.code)}
                                                                                                type="checkbox"
                                                                                                name="classe"
                                                                                                value={item.code}
                                                                                                className="selectgroup-input"
                                                                                                checked={examenForm.classe.includes(item.code)}
                                                                                            />
                                                                                            <span className="selectgroup-button">{item.code}</span>
                                                                                        </label>
                                                                                    )

                                                                                    )
                                                                                )

                                                                            }


                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="modal-footer border-0">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-success"
                                                            >
                                                                <i className='fas fa-save'></i> &nbsp;&nbsp;
                                                                Enregistrer
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                data-dismiss="modal"
                                                                onClick={closeModal}
                                                            >
                                                                <i className='fas fa-times'></i>&nbsp;&nbsp;
                                                                Fermer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                }

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
                                    isVisible && (
                                        <div className="modal-backdrop fade show"></div>
                                    )
                                }

                                {
                                    isVisibleList && (
                                        <div className="modal-backdrop fade show"></div>
                                    )
                                }


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