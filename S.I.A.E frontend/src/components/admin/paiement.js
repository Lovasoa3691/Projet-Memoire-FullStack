import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import axios from 'axios';
import api from '../API/api';

function PaiementContent() {

    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [paieData, setpaieData] = useState([]);
    const [etudiantData, setEtudiantData] = useState([]);
    const [selectedMention, setSelectedMention] = useState(null);
    const [selectedNiveau, setSelectedNiveau] = useState(null);
    const [donneeFiltre, setDonneFiltre] = useState([]);

    const [paiementForm, setPaiementForm] = useState({
        montant: '', typePaie: '', descriptionPaie: [], etudiantId: ''
    });

    const [total, setTotal] = useState(0);

    useEffect(() => {
        chargerPaiements();
    }, []);


    useEffect(() => {
        chargerEtudiants();
    }, []);

    useEffect(() => {
        const total = paieData.reduce((acc, paieemt) => acc + paieemt.montant, 0);
        setTotal(total);
    }, [paieData]);

    const formatDate = (dateHisto) => {
        const current = new Date(dateHisto);
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const hours = String(current.getHours()).padStart(2, '0');
        const minutes = String(current.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const chargerEtudiants = () => {

        api.get('/etudiants')
            .then((rep) => {
                setDonneFiltre(rep.data.etudiant)
                setEtudiantData(rep.data.etudiant);
            })
            .catch(error => {
                console.log("Erreur lors de la recuperation des donnees: ", error);
            })
    };

    const chargerPaiements = () => {
        api.get('/paiements')
            .then((rep) => {

                setpaieData(rep.data.paiements)
            })
            .catch((error) => {
                console.log(error.message)
            })
    }

    const generateMentions = (categories, levels) => {
        return categories.flatMap(category =>
            levels.map(level => ({ code: `${category}${level}` }))
        );
    };


    const [fraisFormation, setFraisFormation] = useState(
        generateMentions(["FF"], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    );

    const handleChangeData = (e) => {
        const { name, value } = e.target;
        setPaiementForm({ ...paiementForm, [name]: value });
    }


    const [isVisible, setVisible] = useState(false);

    const mentionOptions = [
        { value: "DROIT", label: "DROIT" },
        { value: "BTP", label: "BTP" },
        { value: "INFO", label: "INFO" },
        { value: "GM", label: "GM" },
        { value: "ICJ", label: "ICJ" },
    ]

    const niveauOptions = [
        { value: "L1", label: "L1" },
        { value: "L2", label: "L2" },
        { value: "L3", label: "L3" },
        { value: "M1", label: "M1" },
        { value: "M2", label: "M2" },
    ]

    const filtrerData = (mention, niveau) => {
        const filtered = etudiantData.filter(item =>
            (!mention || item.mention === mention.value) &&
            (!niveau || item.niveau === niveau.value)
        )

        setDonneFiltre(filtered);
    }

    const handleMentionChange = (selectedMention) => {
        setSelectedMention(selectedMention)
        filtrerData(selectedMention, selectedNiveau)
    }

    const handleNiveauChange = (selectedNiveau) => {
        setSelectedNiveau(selectedNiveau)
        filtrerData(selectedMention, selectedNiveau)
    }

    const openModal = () => {
        setVisible(true);
    }

    const closeModal = () => {
        setVisible(false);
    }

    const handleCheckChangeFinal = (value) => {
        setPaiementForm((prev) => {
            const updatedPaie = prev.descriptionPaie.includes(value) ?
                prev.descriptionPaie.filter((item) => item !== value)
                : [...prev.descriptionPaie, value];
            return { ...prev, descriptionPaie: updatedPaie };
        });
    }

    const savePaiement = (e) => {
        e.preventDefault();
        try {
            api.post('/paiements/save', paiementForm)
                .then((rep) => {
                    console.log(rep.data.message)
                })
                .catch((err) => {
                    console.log(err.message)
                })
        } catch (error) {
            console.log(error.message);
        }
    }

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
                                        onClick={openModal}
                                    >
                                        <i className="fa fa-plus">&nbsp;&nbsp;</i>
                                        Nouveau Paiement
                                    </button>
                                </div>
                            </div>
                            <div className="card-body">

                                {/* <!-- Modal --> */}
                                {
                                    isVisible && (
                                        <div
                                            className="modal fade show d-block"
                                            // id="addRowModal"
                                            // tabindex="-1"
                                            role="dialog"
                                        // aria-hidden="true"
                                        >
                                            <form onSubmit={savePaiement}>
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header border-0">
                                                            <h5 className="modal-title">
                                                                <span className="fw-mediumbold"> Nouvelle</span>
                                                                <span className="fw-light"> Enregistrement </span>
                                                            </h5>
                                                            <i className='fas fa-times fa-2x' onClick={closeModal}></i>
                                                        </div>
                                                        <div className="modal-body">
                                                            {/* <p className="small">
                                                    Vous devraiz remplir tous les champs
                                                </p> */}

                                                            <div className="row">
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Filtre</label>
                                                                        <div className="row">
                                                                            <di className="col-sm-6">
                                                                                <Select
                                                                                    options={mentionOptions}
                                                                                    placeholder="Mention"
                                                                                    value={selectedMention}
                                                                                    onChange={handleMentionChange}
                                                                                    isClearable
                                                                                />
                                                                            </di>
                                                                            <di className="col-sm-6">
                                                                                <Select
                                                                                    options={niveauOptions}
                                                                                    placeholder="Niveau"
                                                                                    value={selectedNiveau}
                                                                                    onChange={handleNiveauChange}
                                                                                    isClearable
                                                                                />
                                                                            </di>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Nom et Prenom de l'etudiant</label>
                                                                        <select name='etudiantId'
                                                                            className="form-select"
                                                                            value={paiementForm.etudiantId}
                                                                            onChange={handleChangeData}
                                                                        >
                                                                            <option>Choisir...</option>
                                                                            {
                                                                                donneeFiltre && donneeFiltre.map(item => (
                                                                                    <option value={item.matricule}>{item.nomEtu} {item.prenomEtu}</option>
                                                                                ))
                                                                            }
                                                                        </select>


                                                                    </div>
                                                                </div>
                                                                {/* <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Type de paiement</label>
                                                                        <select name='typePaie'
                                                                            className="form-select"
                                                                            value={paiementForm.typePaie}
                                                                            onChange={handleChangeData}
                                                                        >
                                                                            <option value="Frais de formation">Frais de formation</option>
                                                                        </select>
                                                                    </div>
                                                                </div> */}
                                                                <div className="col-md-12">
                                                                    <div className="form-group">
                                                                        <label className="form-label">Description</label>
                                                                        <div className="selectgroup selectgroup-pills">
                                                                            {
                                                                                fraisFormation && fraisFormation.map(item => (
                                                                                    <label className="selectgroup-item" key={item.code}>
                                                                                        <input
                                                                                            onChange={() => handleCheckChangeFinal(item.code)}
                                                                                            type="checkbox"
                                                                                            name="descriptionPaie"
                                                                                            value={item.code}
                                                                                            className="selectgroup-input"
                                                                                            checked={paiementForm.descriptionPaie.includes(item.code)}
                                                                                        />
                                                                                        <span className="selectgroup-button">{item.code}</span>
                                                                                    </label>
                                                                                )
                                                                                )}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-12">
                                                                    <div className="form-group">
                                                                        <label>Montant a paye</label>
                                                                        <div className="input-group mb-3">
                                                                            <span className="input-group-text">Ar</span>
                                                                            <input
                                                                                value={paiementForm.montant}
                                                                                onChange={handleChangeData}
                                                                                type="text"
                                                                                name='montant'
                                                                                className="form-control"
                                                                                aria-label="Amount (to the nearest dollar)"
                                                                            />
                                                                            <span className="input-group-text">.00</span>
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
                                                                Enregistrer
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                data-dismiss="modal"
                                                                onClick={closeModal}
                                                            >
                                                                Fermer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                }

                                {
                                    isVisible && (
                                        <div className="modal-backdrop fade show"></div>
                                    )
                                }




                                {/* <div className="table-responsive"> */}
                                <div className="col-md-12">
                                    <div className="card card-round">

                                        <div className="card-body p-0">
                                            <div className="table-responsive">

                                                <table className="table align-items-center mb-0">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th scope="col">Numero de paiement</th>
                                                            <th scope="col" className="text-end">Date et Heure</th>
                                                            <th scope="col" className="text-end">Montant Total</th>
                                                            <th scope="col" className="text-end">Status</th>
                                                            <th scope="col" className="text-end">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            paieData && paieData.map(item => (
                                                                <tr key={item.idPaie}>
                                                                    <th scope="row">
                                                                        <button
                                                                            className="btn btn-icon btn-round btn-success btn-sm me-2"
                                                                        >
                                                                            <i className="fa fa-check"></i>
                                                                        </button>
                                                                        Paiement de la part de l'etudiant {item.etudiantId}
                                                                    </th>
                                                                    <td className="text-end">{formatDate(item.datePaie)}</td>
                                                                    <td className="text-end">{total} Ariary</td>
                                                                    <td className="text-end">
                                                                        <span className="badge badge-success">Complet</span>
                                                                    </td>
                                                                    <td className="text-end">
                                                                        <i className="fas fa-archive fa-2x"></i>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }


                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <DataTable
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
                                    /> */}
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PaiementContent;