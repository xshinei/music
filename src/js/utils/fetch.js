const BASE_URL = '/api';

export default async (url = '', data = {}, type = 'GET') => {
    url = BASE_URL + url;
    type = type.toLocaleUpperCase();

    if (type === 'GET') {
        let dataStr = '';
        Object.keys(data).forEach(item => {
            dataStr += `${item}=${data[item]}&`;
        });

        if (dataStr !== '') {
            dataStr = dataStr.slice(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    } 

    if (window.fetch) {
        let request = {
            method: type,
            credentials: 'include',
            mode: 'cors',
            cache: 'force-cache',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        if (type === 'POST') {
            Object.assign(request, {
                body: JSON.stringify(data)
            });
        }

        try {
            const response = await fetch(url, request);
            
            if (response.ok) {
                return response.json();
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
};