# Contributing to Crypto Mining DApp

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help maintain a positive environment

## How to Contribute

### Reporting Bugs

If you find a bug:

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Enhancements

For feature requests:

1. **Check existing issues** for similar suggestions
2. **Create a new issue** with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Any relevant examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style
   - Write tests for new features
   - Update documentation
   - Ensure all tests pass

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of changes"
   ```
   
   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Docs:` for documentation changes
   - `Test:` for test additions/changes
   - `Refactor:` for code refactoring

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - List changes made
   - Include test results

## Development Guidelines

### Code Style

#### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for functions
- Keep functions small and focused
- Use latest OpenZeppelin contracts

Example:
```solidity
/**
 * @dev Mine cryptocurrency by providing a valid nonce
 * @param nonce Random value used for mining
 * @return success Whether mining was successful
 */
function mine(bytes32 nonce) external returns (bool success) {
    // Implementation
}
```

#### JavaScript
- Use ES6+ features
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small

Example:
```javascript
/**
 * Connect to MetaMask wallet
 * @returns {Promise<void>}
 */
async function connectWallet() {
    // Implementation
}
```

### Testing

- Write tests for all new features
- Ensure tests are independent
- Use descriptive test names
- Aim for >80% code coverage

Example:
```javascript
describe("Mining", function () {
    it("should reward user with USDT for valid nonce", async function () {
        // Test implementation
    });
});
```

### Documentation

- Update README.md for major changes
- Add JSDoc/NatSpec comments
- Update API.md for API changes
- Include examples in documentation

### Security

- Never commit private keys or secrets
- Use .env for sensitive data
- Follow security best practices
- Report security issues privately

## Project Structure

```
projek-ku/
├── contracts/          # Solidity smart contracts
│   ├── MockUSDT.sol
│   └── CryptoMining.sol
├── scripts/           # Deployment scripts
│   └── deploy.js
├── test/             # Contract tests
│   └── CryptoMining.test.js
├── frontend/         # Web frontend
│   ├── index.html
│   └── app.js
├── backend/          # Backend API
│   └── server.js
├── docs/            # Additional documentation
└── README.md        # Main documentation
```

## Development Workflow

1. **Setup**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Compile**
   ```bash
   npm run compile
   ```

3. **Test**
   ```bash
   npm test
   ```

4. **Deploy (Testnet)**
   ```bash
   npm run deploy:testnet
   ```

5. **Run Locally**
   ```bash
   # Terminal 1
   npm run start:backend
   
   # Terminal 2
   npm run start:frontend
   ```

## Testing Checklist

Before submitting PR:

- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] No secrets in code
- [ ] Tested on local environment
- [ ] Tested on testnet (if applicable)

## Smart Contract Changes

For smart contract modifications:

1. **Write tests first**
2. **Implement changes**
3. **Run full test suite**
4. **Deploy to testnet**
5. **Verify functionality**
6. **Update documentation**

### Security Considerations

- Use OpenZeppelin contracts when possible
- Avoid external calls when possible
- Check for reentrancy vulnerabilities
- Validate all inputs
- Use SafeMath (or Solidity 0.8+)
- Test edge cases

## Frontend Changes

For frontend modifications:

1. **Test with MetaMask**
2. **Test on different browsers**
3. **Ensure mobile responsiveness**
4. **Update UI/UX documentation**
5. **Test error handling**

## Backend Changes

For backend modifications:

1. **Add endpoint tests**
2. **Update API documentation**
3. **Test error handling**
4. **Consider rate limiting**
5. **Check security implications**

## Review Process

1. **Maintainer reviews** PR
2. **Address feedback**
3. **Tests must pass**
4. **Documentation must be updated**
5. **At least one approval** required
6. **Merge** when approved

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to testnet
5. Announce release

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues/PRs for similar topics

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in README.md

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Crypto Mining DApp! 🎉
