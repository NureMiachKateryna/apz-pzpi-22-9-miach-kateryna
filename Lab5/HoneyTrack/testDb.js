// testDb.js
const userService = require('./services/userService'); 
const honeyBatchService = require('./services/honeyBatchService');


async function runTests() {
    console.log("Starting database tests...");
    let testUser;

    try {
 
        console.log("\nAttempting to create a user...");
        const newUser = await userService.createUser({
            username: `testuser_${Date.now()}`, 
            password_hash: 'securepassword123', 
            email: `test_${Date.now()}@example.com` 
        });
        testUser = newUser; 
        console.log("User created successfully:", testUser);


        console.log("\nAttempting to find the created user by ID...");
        const foundUserById = await userService.findUserById(testUser.user_id);
        console.log("User found by ID:", foundUserById);

        console.log("\nAttempting to find the created user by username...");
        const foundUserByUsername = await userService.findUserByUsername(testUser.username);
        console.log("User found by username:", foundUserByUsername);

 
        if (foundUserById) {
            console.log("\nAttempting to create a honey batch...");
            const newBatch = await honeyBatchService.createHoneyBatch(foundUserById.user_id, {
                name: 'Весняний мед 2024',
                sort: 'Різнотравя',
                collection_date: '2024-05-20',
                quantity: 5.5,
                unit: 'кг',
                notes: 'Перший збір'
            });
            console.log("Honey batch created successfully:", newBatch);

            console.log("\nAttempting to get all honey batches for the user...");
            const userBatches = await honeyBatchService.getAllHoneyBatchesForUser(foundUserById.user_id);
            console.log(`Honey batches for user ${foundUserById.username}:`, userBatches);
        }

   
        console.log("\nAttempting to update the user's email...");
        const updatedUserData = await userService.updateUser(testUser.user_id, { email: `updated_${Date.now()}@example.com` });
        console.log("User updated successfully:", updatedUserData);


    } catch (error) {
        console.error("!!!!!!!!!! TEST ERROR !!!!!!!!!!!");
        console.error(error.message);
        if (error.errors) { 
            error.errors.forEach(err => console.error(`- ${err.path}: ${err.message}`));
        }
    } finally {
        const { sequelize } = require('./models'); 
        if (sequelize) {
            await sequelize.close();
            console.log('\nDatabase connection closed.');
        }
    }
}

runTests();