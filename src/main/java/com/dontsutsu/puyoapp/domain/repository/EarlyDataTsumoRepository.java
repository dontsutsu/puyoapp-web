package com.dontsutsu.puyoapp.domain.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import com.dontsutsu.puyoapp.domain.entity.EarlyDataTsumo;

/**
 * @author f-akamatsu
 */
@Repository
public class EarlyDataTsumoRepository {

	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

	public List<EarlyDataTsumo> findByEarlyDataKey(Integer playerId, String date, Integer seq) {
		String sql = "SELECT * "
					+ "FROM early_data_tsumo "
					+ "WHERE player_id = :playerId "
					+ "  AND date = :date "
					+ "  AND seq = :seq "
					+ "ORDER BY tsumo_no ";
		SqlParameterSource param = new MapSqlParameterSource()
				.addValue("playerId", playerId)
				.addValue("date", date)
				.addValue("seq", seq);
		try {
			return jdbcTemplate.query(
					sql,
					param,
					new BeanPropertyRowMapper<EarlyDataTsumo>(EarlyDataTsumo.class)
					);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}
}
