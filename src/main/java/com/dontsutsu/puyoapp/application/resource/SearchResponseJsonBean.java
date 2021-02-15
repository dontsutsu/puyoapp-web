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
				data.setAx(t.getAxisX() + "");
				data.setAy(1 + "");
				data.setAc(t.getAxisPuyo().getColor() + "");
				data.setCx(t.getChildX() + "");
				data.setCy((1 + t.getChildPosition().getChildRelativeY()) + "");
				data.setCc(t.getChildPuyo().getColor() + "");
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
		private String ax;
		private String ay;
		private String ac;
		private String cx;
		private String cy;
		private String cc;
		public String getAx() {
			return ax;
		}
		public void setAx(String ax) {
			this.ax = ax;
		}
		public String getAy() {
			return ay;
		}
		public void setAy(String ay) {
			this.ay = ay;
		}
		public String getAc() {
			return ac;
		}
		public void setAc(String ac) {
			this.ac = ac;
		}
		public String getCx() {
			return cx;
		}
		public void setCx(String cx) {
			this.cx = cx;
		}
		public String getCy() {
			return cy;
		}
		public void setCy(String cy) {
			this.cy = cy;
		}
		public String getCc() {
			return cc;
		}
		public void setCc(String cc) {
			this.cc = cc;
		}
	}

}
