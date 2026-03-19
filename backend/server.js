require("dotenv").config();
const app = require('./app');
const connectDB = require('./db');
const authRoutes = require('./routes/auth.routes');

const PORT = process.env.PORT || 8000;

app.use('/api/auth', authRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error(error);
});
