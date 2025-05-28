const { exec } = require("child_process");

function runMigration() {
    const command = 'npx cross-env NODE_ENV=migration npm run migration:run';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing migration: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Error output: ${stderr}`);
            return;
        }

        console.log(`Migration output: ${stdout}`);
    });
}

runMigration();
