package com.dontsutsu.puyoapp.application.resource;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.dontsutsu.puyopuyo.Tsumo;

public class SearchResponseJsonBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private List<List<ResponseTsumoData>> correctList;

	public SearchResponseJsonBean(List<List<Tsumo>> result) {

		List<List<ResponseTsumoData>> correctList = new ArrayList<>();

		for (int i = 0; i < result.size(); i++) {

			List<Tsumo> tsumoList = result.get(i);
			List<ResponseTsumoData> list2 = new ArrayList<>();

			for (int j = 0; j < tsumoList.size(); j++) {
				ResponseTsumoData data = new ResponseTsumoData();
				Tsumo t = tsumoList.get(j);
				data.setAxisColor(t.getAxisPuyo().getColor() + "");
				data.setChildColor(t.getChildPuyo().getColor() + "");
				data.setAxisX(t.getAxisX() + "");
				data.setTsumoPosition(t.getChildPosition().getName());
				list2.add(data);
			}
			correctList.add(list2);
		}

		setCorrectList(correctList);
	}

	public List<List<ResponseTsumoData>> getCorrectList() {
		return correctList;
	}

	public void setCorrectList(List<List<ResponseTsumoData>> correctList) {
		this.correctList = correctList;
	}

	public class ResponseTsumoData {
		private String axisColor;
		private String childColor;
		private String tsumoPosition;
		private String axisX;
		public String getAxisColor() {
			return axisColor;
		}
		public void setAxisColor(String axisColor) {
			this.axisColor = axisColor;
		}
		public String getChildColor() {
			return childColor;
		}
		public void setChildColor(String childColor) {
			this.childColor = childColor;
		}
		public String getTsumoPosition() {
			return tsumoPosition;
		}
		public void setTsumoPosition(String tsumoPosition) {
			this.tsumoPosition = tsumoPosition;
		}
		public String getAxisX() {
			return axisX;
		}
		public void setAxisX(String axisX) {
			this.axisX = axisX;
		}
	}

}
