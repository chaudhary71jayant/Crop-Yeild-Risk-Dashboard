import "dotenv/config";

const required = ["DATABASE_URL"]

for(const key of required){
    if(!process.env[key]){
        throw new Error(`Missing required environment variable : ${key}`);
    }
}

const env = {
    PORT : process.env.PORT ||  8080,
    DATABASE_URL : process.env.DATABASE_URL,
    NODE_ENV :  process.env.NODE_ENV || "development"
};

export { env};