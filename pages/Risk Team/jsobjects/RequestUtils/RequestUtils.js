export default {
	requestStatusFilters: Object.values(RequestStatusEnum).map((status) => ({
		code: status,
		name: status
	})),
	async getDocumentUrl(fileName) {
		storeValue("tab", fileName);
		const index = fileName === "Credit history" ? 0 : 1;
		const attachments = getLoanRequests.data.requests[RequestList_Risky.selectedRowIndex]?.attachments;
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
			case RequestStatusEnum.APPROVED:
				color = "#2ECC71"
				break;
			case RequestStatusEnum.DOCUMENT_INVALID:
				color = "#E74C3C"
				break;
			case RequestStatusEnum.REJECTED:
				color = " #E74C3C"
				break;
		}
		return color;
	},
	async loadRequestWithDocument() {
		const requests = await getLoanRequests.run();
		if (!requests.length) return null;
		if (!RequestList_Risky.selectedRow) return null;
		const attachments = RequestList_Risky.selectedRow.attachments;
		const att = attachments[0]
		await getDocument.run({ contentStorageId: att.contentStorageId, mimeType: att.mimeType })
	},
	async ExecuteRiskCheck(riskTaskId, isOk, decisionReason) {
		try {
			await reviewLoanRequest.run({riskTaskId, isOk, decisionReason});
			showAlert("Validation action made with sucess", "success");
			closeModal(Risk_Submission_Modal.name);
			setInterval(() => 2000);
			await getLoanRequests.run();
		} catch (err) {
			showAlert("There was an error", "error")
		}

	}
}