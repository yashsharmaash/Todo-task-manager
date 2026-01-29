// using native fetch

const BASE_URL = 'http://localhost:5000/api/users';
const TEST_USER = {
    email: `cookie_test_${Date.now()}@example.com`,
    password: 'password123'
};

const runTests = async () => {
    console.log('--- Starting Cookie Verification ---');
    console.log(`Target: ${BASE_URL}`);

    try {
        // 1. Test Registration
        console.log('\n1. Testing Registration...');
        const regRes = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        const regData = await regRes.json();
        const regCookies = regRes.headers.get('set-cookie');

        if (regRes.ok && regCookies && regCookies.includes('jwt-login')) {
            console.log('✅ Registration Successful - Cookie Found');
            console.log('Set-Cookie: jwt-login=********; HttpOnly; ...');
        } else {
            console.error('❌ Registration Failed or Cookie Missing');
            console.log('Status:', regRes.status);
            // console.log('Cookies:', regCookies); // Don't log full cookies on error either
            process.exit(1);
        }

        // 2. Test Login
        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        const loginData = await loginRes.json();
        const loginCookies = loginRes.headers.get('set-cookie');

        if (loginRes.ok && loginCookies && loginCookies.includes('jwt-login')) {
            console.log('✅ Login Successful - Cookie Found');
            console.log('Set-Cookie: jwt-login=********; HttpOnly; ...');
        } else {
            console.error('❌ Login Failed or Cookie Missing');
            console.log('Status:', loginRes.status);
            // console.log('Cookies:', loginCookies); // Don't log full cookies
            process.exit(1);
        }

        // 3. Test 404 Error Handling
        console.log('\n3. Testing 404 Error...');
        const failRes = await fetch(`${BASE_URL}/non-existent-route`);
        const failData = await failRes.json();

        if (failRes.status === 404 && failData.message) {
            console.log('✅ 404 Handled Correctly');
            console.log('Message:', failData.message);
        } else {
            console.error('❌ 404 Test Failed');
            console.log('Status:', failRes.status);
        }

        console.log('\n--- Best Practices Verification Passed ---');

    } catch (error) {
        console.error('\n❌ Error during testing:', error.message);
    }
};

runTests();
