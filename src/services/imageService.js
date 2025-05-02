export const uploadImage = async (file) => {
  try {
    console.log('=== Début du téléchargement de l\'image ===');
    console.log('Fichier reçu:', file);
    
    // Vérification des variables d'environnement
    const username = process.env.REACT_APP_GITHUB_USERNAME;
    const repo = process.env.REACT_APP_GITHUB_REPO;
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    
    console.log('Configuration GitHub:', {
      username: username || 'NON CONFIGURÉ',
      repo: repo || 'NON CONFIGURÉ',
      hasToken: !!token
    });

    if (!username || !repo || !token) {
      console.error('Variables d\'environnement manquantes:', {
        username: !username,
        repo: !repo,
        token: !token
      });
      throw new Error('Configuration GitHub manquante. Vérifiez les variables d\'environnement dans Netlify.');
    }

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      console.error('Type de fichier invalide:', file.type);
      throw new Error('Le fichier doit être une image');
    }

    // Vérifier si le dossier images/products existe
    try {
      console.log('Vérification du dossier images/products...');
      const checkResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/images/products`,
        {
          headers: {
            'Authorization': `token ${token}`,
          }
        }
      );

      console.log('Statut de la vérification:', checkResponse.status);

      if (checkResponse.status === 404) {
        console.log('Le dossier images/products n\'existe pas, création en cours...');
        // Créer le dossier images
        const createImagesResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo}/contents/images/.gitkeep`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Création du dossier images',
              content: '',
              branch: 'main'
            })
          }
        );
        console.log('Statut de création du dossier images:', createImagesResponse.status);

        // Créer le dossier products
        const createProductsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo}/contents/images/products/.gitkeep`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Création du dossier products',
              content: '',
              branch: 'main'
            })
          }
        );
        console.log('Statut de création du dossier products:', createProductsResponse.status);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification/création des dossiers:', error);
      throw new Error('Erreur lors de la création des dossiers: ' + error.message);
    }

    // Convertir le fichier en base64
    console.log('Conversion en base64...');
    const base64Image = await convertToBase64(file);
    console.log('Conversion réussie');
    
    // Créer le nom du fichier
    const fileName = `images/products/${Date.now()}-${file.name}`;
    console.log('Nom du fichier:', fileName);
    
    // Préparer la requête
    const content = base64Image.split(',')[1];
    const url = `https://api.github.com/repos/${username}/${repo}/contents/${fileName}`;
    
    console.log('Envoi de la requête à GitHub...');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Ajout d\'une nouvelle image de produit',
        content: content,
        branch: 'main'
      })
    });

    console.log('Réponse reçue:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur GitHub:', errorData);
      throw new Error(`Erreur GitHub: ${errorData.message}`);
    }

    const data = await response.json();
    console.log('Image téléchargée avec succès:', data.content.download_url);
    return data.content.download_url;
  } catch (error) {
    console.error('Erreur complète:', error);
    throw new Error(`Erreur lors du téléchargement de l'image: ${error.message}`);
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const deleteImage = async (path) => {
  try {
    console.log('Tentative de suppression de l\'image:', path);
    
    // Récupérer le SHA du fichier
    const getResponse = await fetch(
      `https://api.github.com/repos/${process.env.REACT_APP_GITHUB_USERNAME}/${process.env.REACT_APP_GITHUB_REPO}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
        }
      }
    );

    if (!getResponse.ok) {
      const errorData = await getResponse.json();
      console.error('Erreur lors de la récupération du fichier:', errorData);
      throw new Error(`Erreur lors de la récupération du fichier: ${errorData.message}`);
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha;

    // Supprimer le fichier
    const deleteResponse = await fetch(
      `https://api.github.com/repos/${process.env.REACT_APP_GITHUB_USERNAME}/${process.env.REACT_APP_GITHUB_REPO}/contents/${path}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Suppression d\'une image de produit',
          sha: sha,
          branch: 'main'
        })
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error('Erreur lors de la suppression:', errorData);
      throw new Error(`Erreur lors de la suppression de l'image: ${errorData.message}`);
    }

    console.log('Image supprimée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw new Error(`Erreur lors de la suppression de l'image: ${error.message}`);
  }
}; 