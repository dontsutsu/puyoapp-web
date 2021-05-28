package com.dontsutsu.puyoapp.domain.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Repository;

import com.dontsutsu.puyoapp.domain.entity.EarlyData;

/**
 * @author f-akamatsu
 */
@Repository
public class EarlyDataRepository {

	@Autowired
	private NamedParameterJdbcTemplate jdbcTemplate;

	public List<EarlyData> findByPlayerId(Integer playerId) {
		String sql = "SELECT * "
					+ "FROM early_data "
					+ "WHERE player_id = :playerId "
					+ "ORDER BY date DESC, seq ASC ";
		SqlParameterSource param = new MapSqlParameterSource().addValue("playerId", playerId);
		try {
			return jdbcTemplate.query(
					sql,
					param,
					new BeanPropertyRowMapper<EarlyData>(EarlyData.class)
					);
		} catch (EmptyResultDataAccessException e) {
			return null;
		}
	}
}
