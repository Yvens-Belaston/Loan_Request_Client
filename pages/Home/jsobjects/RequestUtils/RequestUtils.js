export default {
	requestStatusFilters: Object.values(RequestStatusEnum).map((status) => ({
		code: status,
		name: status
	})),
	async updateCustomer(customer, persistenceId) {
		try {
			await updateCustomer.run({customer, persistenceId});
			await getLoanRequests.run();
			showAlert("Customer updated with success", "success")
		} catch(err) {
			showAlert("There was en error updating the customer please try again later", "error")
		}
	},
	async getDocumentUrl(fileName) {
		storeValue("tab", fileName);
		const index = fileName === "Credit history" ? 0 : 1;
		const attachments = getLoanRequests.data.requests[RequestList.selectedRowIndex]?.attachments;
		if (!attachments) return null;
		const att = attachments[index];
		const response  = await getDocument.run({ contentStorageId: att.contentStorageId, mimeType: att.mimeType })
		let baseUrl;
		baseUrl = response.base64Url;
		console.log("getDocument response", response);
		return baseUrl;
	},
	getCellColorByStatus (status) {
		let color;
		switch(status) {
			case RequestStatusEnum.PENDING:
				color = "#F1C40F"
				break;
			case RequestStatusEnum.SUBMITTED:
				color = "#3498DB"
				break;
				/*case RequestStatusEnum.APPROVED:
				color = "#2ECC71"
				break;*/
			case RequestStatusEnum.REJECTED:
				color = " #E74C3C"
				break;
		}
		return color;
	},
	async openCustomerModel(selectedRowIndex) {
		await RequestList.setSelectedRowIndex(selectedRowIndex);
		showModal(Customer_Details_Modal.name);
	},
	async loadRequestWithDocument() {
		await getLoanRequests.run();
		const attachments = RequestList.selectedRow.attachments;
		const att = attachments[0]
		await getDocument.run({ contentStorageId: att.contentStorageId, mimeType: att.mimeType })
	},
	async executeValidateDocs(taskId, isValid) {
		try {
			await validateDocs.run({taskId, isValid});
			await getLoanRequests.run();
			showAlert("Validation action made with sucess", "success")
		} catch (err) {
			showAlert("There was an error", "error")
		}
	},
	async ExecuteRiskCheck(riskTaskId, isOk, decisionReason) {
		try {
			await reviewLoanRequest.run({riskTaskId, isOk, decisionReason});
			showAlert("Validation action made with sucess", "success")
			await getLoanRequests.run();
			closeModal(Risk_Submission_Modal.name);
		} catch (err) {
			showAlert("There was an error", "error")
		}

	}
}