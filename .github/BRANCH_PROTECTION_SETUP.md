# Branch Protection Setup Guide

**Complete this setup on GitHub to enable robust change tracking.**

## Steps to Configure Branch Protection

### 1. Navigate to Repository Settings

1. Go to https://github.com/kidhardt/spanish-academic
2. Click **"Settings"** tab
3. Click **"Branches"** in left sidebar

### 2. Add Branch Protection Rule

1. Click **"Add branch protection rule"**
2. Enter **branch name pattern:** `master`

### 3. Configure Protection Settings

Check the following boxes:

#### Require Pull Request Reviews

- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** 1
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ **Require review from Code Owners**

#### Require Status Checks

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**

  **Add these required status checks** (after first CI run):
  - `Enforce File Protection Rules`
  - `Run Full Validation Suite`
  - `Verify CODEOWNERS Coverage`

#### Additional Settings

- ✅ **Require conversation resolution before merging**
- ✅ **Require linear history** (optional - enforces rebase)
- ✅ **Do not allow bypassing the above settings**
- ❌ **Allow force pushes** - LEAVE UNCHECKED
- ❌ **Allow deletions** - LEAVE UNCHECKED

### 4. Save Changes

Click **"Create"** or **"Save changes"** at the bottom

---

## Verification

After setup, verify protection is working:

```bash
# Try to push directly to master (should fail)
git checkout master
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push origin master
# Expected: Error - protected branch
```

Correct workflow:
```bash
# Create feature branch
git checkout -b feature/test
git push -u origin feature/test

# Create PR on GitHub
# PR will run CI/CD checks
# After approval + CI passes → merge via GitHub UI
```

---

## Troubleshooting

**Problem:** Cannot find "Branches" in settings

**Solution:** Ensure you have admin access to the repository

---

**Problem:** Required status checks not appearing

**Solution:**
1. Create a PR first to trigger CI/CD
2. After CI runs once, status check names will appear in dropdown
3. Edit branch protection rule and add the check names

---

**Problem:** Cannot bypass rules even as admin

**Expected:** This is correct behavior when "Do not allow bypassing" is checked

**Solution:** If emergency bypass needed, temporarily disable branch protection, make change, re-enable immediately

---

## Next Steps After Setup

1. ✅ Test by creating a sample PR
2. ✅ Verify CI/CD runs automatically
3. ✅ Confirm CODEOWNERS enforcement works
4. ✅ Document in team wiki/docs that protection is active

---

**Documentation:** Full details in [docs/GITHUB_WORKFLOW.md](../docs/GITHUB_WORKFLOW.md)
