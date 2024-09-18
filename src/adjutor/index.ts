import axios from 'axios';

class Karma {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string | undefined) {
        if (!apiKey) {
            throw new Error('API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://adjutor.lendsqr.com/v2';
    }

    async isOnBlacklist(email: string): Promise<boolean> {
        const url = `${this.baseUrl}/verification/karma/${encodeURIComponent(email)}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const user = response.data?.data;
            return !!user; 
        } catch (err: any) {
            if (
                err.response?.status === 404 &&
                err.response?.data?.message === 'Identity not found in karma'
            ) {
                return false;
            }

            console.error('Error in isOnBlacklist:', err.message || err);
            throw err;
        }
    }
}

export default new Karma(process.env.ADJUTOR_SECRET_KEY);
