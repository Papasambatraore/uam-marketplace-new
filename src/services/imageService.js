export const uploadImage = async (file) => {
  try {
    console.log('=== Début du téléchargement de l\'image ===');
    console.log('Fichier reçu:', file);
    
    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
    }

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

    // Compression de l'image
    console.log('Compression de l\'image...');
    const compressedFile = await compressImage(file);
    console.log('Image compressée:', compressedFile);

    // Convertir le fichier en base64
    console.log('Conversion en base64...');
    const base64Image = await convertToBase64(compressedFile);
    console.log('Conversion réussie');
    
    // Créer le nom du fichier
    const fileName = `images/products/${Date.now()}-${compressedFile.name}`;
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
      if (response.status === 404) {
        throw new Error('Le dépôt GitHub n\'existe pas ou n\'est pas accessible');
      }
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

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Réduire la taille si nécessaire
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en JPEG avec une qualité de 0.7
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
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