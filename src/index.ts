import axios from 'axios';

exports.handler = async (event: any) => {
    const address = event.address;

    const id = await getId(address);

    let propertyData: any;

    if (id) {
        try {
            propertyData = await getPropertyData(id);

            return propertyData;
        }
        catch (e) {
            return { message: `Unable to get Realtor.com price data for: ${address}.` };

        }
    }
    else {
        return { message: `No Realtor page found for: ${address}` };
    }
}

export async function getId(address: string) {
    const url = `https://www.realtor.com/api/v1/parser/suggest?input=${address}`;

    const axiosResponse = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
        }
    });

    return axiosResponse?.data?.result[0]?.mpr_id;
}



export async function getPropertyData(id: string) {
    const url = `https://mapi-ng.rdc.moveaws.com/api/v1/properties/O${id}?client_id=haven`;

    const axiosResponse = await axios.get(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
        }
    });

    const propertyData = {
        price: axiosResponse?.data?.properties[0]?.price
    };

    return propertyData;
}

