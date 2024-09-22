// Function to recursively get all files in the repository
export async function getAllFiles(context:any, owner:string, repo:string, path:string = '') {
  
  const { data } = await context.octokit.repos.getContent({
    owner: owner,
    repo: repo,
    path,
  });

  let files:any[] = [];
  for (const item of data) {
    if (item.type === 'file') {
      files.push(item);
    } else if (item.type === 'dir') {
      files = files.concat(await getAllFiles(context, owner, repo, item.path));
    }
  }
  return files;
};
