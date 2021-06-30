export type Historique = 
{
    dateAchat: Date,
    listeItem:
    {
        nomItem: string,
        prixItem: number,
        qte: number
    }
}