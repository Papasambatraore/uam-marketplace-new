import axios from 'axios';

const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = process.env.REACT_APP_GITHUB_USERNAME;
const REPO_NAME = process.env.REACT_APP_GITHUB_REPO;
const ADS_FILE_PATH = 'data/ads.json';

const githubApi = axios.create({
  baseURL: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
  headers: {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  }
});

export const getAds = async () => {
  try {
    const response = await githubApi.get(`/contents/${ADS_FILE_PATH}`);
    const content = atob(response.data.content);
    return JSON.parse(content);
  } catch (error) {
    if (error.response?.status === 404) {
      // Si le fichier n'existe pas, on le crée avec un tableau vide
      await createAdsFile([]);
      return [];
    }
    throw error;
  }
};

export const saveAds = async (ads) => {
  try {
    // Récupérer le SHA du fichier existant
    const response = await githubApi.get(`/contents/${ADS_FILE_PATH}`);
    const sha = response.data.sha;

    // Mettre à jour le fichier
    await githubApi.put(`/contents/${ADS_FILE_PATH}`, {
      message: 'Mise à jour des annonces',
      content: btoa(JSON.stringify(ads, null, 2)),
      sha: sha
    });
  } catch (error) {
    if (error.response?.status === 404) {
      // Si le fichier n'existe pas, on le crée
      await createAdsFile(ads);
    } else {
      throw error;
    }
  }
};

const createAdsFile = async (ads) => {
  await githubApi.put(`/contents/${ADS_FILE_PATH}`, {
    message: 'Création du fichier des annonces',
    content: btoa(JSON.stringify(ads, null, 2))
  });
};

export const addAd = async (newAd) => {
  const ads = await getAds();
  ads.push(newAd);
  await saveAds(ads);
  return newAd;
};

export const updateAd = async (updatedAd) => {
  const ads = await getAds();
  const index = ads.findIndex(ad => ad.id === updatedAd.id);
  if (index !== -1) {
    ads[index] = updatedAd;
    await saveAds(ads);
    return updatedAd;
  }
  throw new Error('Annonce non trouvée');
};

export const deleteAd = async (adId) => {
  const ads = await getAds();
  const filteredAds = ads.filter(ad => ad.id !== adId);
  await saveAds(filteredAds);
}; 