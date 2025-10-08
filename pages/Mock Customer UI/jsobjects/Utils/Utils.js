export default {
	files: null,
	async getFileUpload (files) {
		//const files = FilePicker.files;
		console.log("FILES: ", files)

		const promises = files.map((file) => {
			return formFileUpload.run({ file: file });
		});
		console.log("promises", promises)

		try {
			const results = await Promise.all(promises);
			console.log("results", results)
			const santizedResult = results.map(result => JSON.parse(result));
			console.log("SANITIZED RESULTS: ", santizedResult);
			this.files = santizedResult;
			return santizedResult;
		} catch (error) {
			console.error('The error is ', error);
			throw error;
		}
	},
	async uploadMultipleFiles(files) {
		// Avoid uploading file if there is less than a certain number of files, here 2 for example
		// FilePicker.files.length
		if(files.length >= 2) {
			const result = await this.getFileUpload(files);
			console.log("&&&&& ", result);
			showAlert(`${files.length} uploaded with success`, "success");
			return result;
		} else {
			showAlert("Not enough files to use the multiple file picker", "error");
			return null;
		}
	},
	async instantiateProcess () {
		try {
			await instantiateProcess.run();
			navigateTo("Home");
		} catch(err) {
			showAlert("There was a problem with the instantiation of the process, check the console or more information", "error");
			console.error(err);
		}
	},
	async showDocumentModal() {
		try {
			await getUpdateTaskContext.run();
			showModal(Document_To_Update_Modal.name);
		} catch(err) {
			showAlert("There was a problem with the showDocumentModal", "error");
			console.error(err);
		}

	},
	async confirmDocumentUpdate() {
		try {
			await executeUpdateDocsTask.run();
			await getHumanTasksInstances.run();
			closeModal(Document_To_Update_Modal.name);
		} catch(err) {
			showAlert("There was a problem with the confirmDocumentUpdate", "error");
			console.error(err);
		}
	}
}