const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = 'https://752uv9np1l.execute-api.eu-west-3.amazonaws.com/dev';
const TEST_TOKEN = 'eyJraWQiOiJcL1RaN2gwdU1FNU5OWWFjRFNRZkYyMFRTd2lpMktDYWxjOWI5UDRweFJvQT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTA5MjAzZS05MGUxLTcwYWEtNTFkMS05ZjE3NWJiOTNkYmIiLCJjb2duaXRvOmdyb3VwcyI6WyJwcm9mZXNzaW9uYWwiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMy5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTNfbU5ncHMydTRPIiwiY2xpZW50X2lkIjoiMTlqNGJ1NzRxcHBrODNrZjNzZmh1aTI0aHEiLCJvcmlnaW5fanRpIjoiMGIwN2FmMjctYzVmYS00Y2NlLWExNGUtYzg0MGNmOWU2YjNmIiwiZXhwIjoxNzM1NjQ4NzE5LCJpYXQiOjE3MzU2NDUxMTl9.EuVd0F6ZG-EqgNblo7L_LWQpBSEgLIs5m4OQiVpa8ZFxBWcIvvNGQu-i8dEgryGv76e-m-CoZR8jcJaQVAQKnlsYmp_IJ0bXx0kARboyGuvZxwp3RBEE2XQOni4qnncpUObAq4-YPIHMTOwbMQP6X6etvXZjjlZzd83-ruOjKdbgZw7p-MnSvZIVIUT9ppUOBbwKP2eR9snqEgmS_WzPiFjJSJU01lNE3torQ1NZwj6ih3a_iTCGJiJN0LxA5vcEqeXXXhFuzBUg7o03h_uhciJPrbg2iMvofBaRPdpHCu4LHE6fqYlZVcr8E_vU9ZESbt7A9mqK8_6IOLl_QmGA9Q.6yyuGkeSpApl8ymG.bmzUyxn3BOoVJ1l2T8Fo1aZH9cWTgB9kgrbrzdWfUhNo6z2AK9OZSTBcFa0kBd2egXNafqLOlrhrLa_1T6oEd9UERrAZTUJJUWqltobVoDntADfQmJiMhQO3kn9IN2jchG3qScvSpVtB_pAsaDc5hQh2c4KqWNVFsWON6o9eqgPIrPz3FE3R_DvsCFOlAgMjBirB61KMBkNB4k6IFzkd0XDdjo9zajf5DXC0-pC1IQQLTTXOEmLH1EKkG7W_AmuEcd7Pnh1D_ECvAQB1U0E5kh6dP6AHzmLVbCtRLjbnG-wgoOaej43rCGvXm8xVsZkEu58U5FN9Z2RGgyxk_uNGOGr-2Y5PbYF5eTen73lKhJy89-3EN8OaJ8t_Y3V3fnXggUqvvEezSpUJUsKxbcaruCsMQOrLX6yTbWdu6OjL-3R5dCyqfawCyBfWfAS84maDhIYESws1g_fqnxTxRoF5mjfSeMF0mfTYnBoZ9hql0ltJdJhmtlfXjSScx_rrHcIqak3cw_QdiknZnJZPurll_74Lq3a0r6ltOv7-mej7pDyh97nzQbZ7D49LyRFeh0HWPw1-DHknGcosdKPPnPNLTwZRHBEhBfh9eqjfiI0FgeHzBpySTR_y7hC-_WTTzhVGOxdMrjwGwczySlm4v2Kf25IlRZQzUSIH6mApxtlinixBosXmnFBa8E4LhCG_8ciQAeb2AHlgq7RX_lyV06xuJyysI8Us4n9V0rrDmKL4uhMDRXohDfgBlKXoH1cONrgxvEDkssC27_Z0iHATfINPQ0HylYA8bshA7AiFqUI3sRBQDjMplABLgXBUk4r0kInuiQ35PKgJDi4jqkujLyhkozTW4caRxal9htgKivkY3tzNLKCZVUFPiMaYTP-tn279jwJAOXeVC2fILJR5FxZwXhc10BYzcoD29TIeOu19XUavPj5TFVplRnilXq_7RX4uwUeVjAA8WjtOHRsuDtj1gjfwwHnqXT112cjr5FNuO1Q-gVqorhCwnQQMEZrlivIJhRr92hv9y5J_DsOwbMOAw4blb49JKOeD5um2v_iP2eih8RNNJCwVaDRyk4eUZ_rAW3Og15xT3FMw7gd2y6n2xmL3fYsaHDig532FwlazlKBJdU61uSecUh-0T5__hYNnxspqbMJ_aL9ZzNjYD1aOU41iQLKBqXWeztMkbw_NUTCmFFPONQccmE2T0j7-MFe3Fn0taeqAVnh1EL0xILDXExvBZKeqbGDHjqsdUwGg0cDZHKJUwfzmDaOgrJUBRfvGOQ39IYsRDXYpNHXe4Q3FsFaG5DI4-ceZZzvJw.tHZkjOj29N1s1kIU-VizWg';

async function testNewStatus() {
  console.log('🧪 Test des nouveaux statuts...');
  
  try {
    // 1. Créer une nouvelle propriété (devrait être IN_PROGRESS)
    console.log('\n1️⃣ Création d\'une nouvelle propriété...');
    const createResponse = await axios.post(`${API_BASE_URL}/properties`, {
      step: 'basic',
      data: {
        title: 'Test Property - New Status',
        propertyType: 'Apartment',
        status: 'IN_PROGRESS',
        surface: 100,
        bedrooms: 2,
        bathrooms: 1,
        yearBuilt: 2020,
        energyClass: 'A',
        description: 'Test property for new status system',
        country: 'France',
        state: 'Île-de-France',
        city: 'Paris'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Création réussie:', createResponse.data);
    const propertyId = createResponse.data.data.propertyId;
    const initialStatus = createResponse.data.data.status;
    
    console.log(`📋 Property ID: ${propertyId}`);
    console.log(`🏷️  Statut initial: ${initialStatus}`);

    // 2. Mettre à jour vers COMMERCIALIZED
    console.log('\n2️⃣ Mise à jour vers COMMERCIALIZED...');
    const updateResponse = await axios.put(`${API_BASE_URL}/properties/${propertyId}`, {
      step: 'contact',
      data: {
        contactInfo: {
          name: 'Test Contact',
          email: 'test@example.com',
          phone: '+33123456789'
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Mise à jour réussie:', updateResponse.data);
    const finalStatus = updateResponse.data.data.status;
    console.log(`🏷️  Statut final: ${finalStatus}`);

    // 3. Vérifier les statuts
    console.log('\n3️⃣ Vérification des statuts...');
    console.log(`📊 Statut initial: ${initialStatus} (devrait être IN_PROGRESS)`);
    console.log(`📊 Statut final: ${finalStatus} (devrait être COMMERCIALIZED)`);
    
    if (initialStatus === 'IN_PROGRESS' && finalStatus === 'COMMERCIALIZED') {
      console.log('✅ Test réussi ! Les nouveaux statuts fonctionnent correctement.');
    } else {
      console.log('❌ Test échoué ! Les statuts ne correspondent pas aux attentes.');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

testNewStatus(); 
 